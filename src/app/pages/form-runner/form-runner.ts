import { Component, computed, effect, inject, input, resource, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AnswerService } from '../../core/answer.service';
import { FormService } from '../../core/form.service';
import { toEmbedUrl } from '../../core/media';
import { Answer, AnswerValue, Form, MediaItem, Step, isMalformed, isMultipleValue, isOtherValue } from '../../core/models';
import { htmlToText } from '../../shared/rich-text';
import { QuestionInput } from './question-input';

/** Un écran du parcours : un média, l'introduction d'une partie, un texte ou une question. */
interface Screen {
  key: string;
  kind: 'media' | 'intro' | 'info' | 'question';
  step: Step;
  section?: Step;
  media?: MediaItem;
  embedUrl?: SafeResourceUrl;
  number?: number;
}

@Component({
  selector: 'app-form-runner',
  imports: [QuestionInput, RouterLink],
  templateUrl: './form-runner.html',
  host: { '(document:keydown.enter)': 'onEnter($event)' },
})
export class FormRunner {
  private readonly formService = inject(FormService);
  private readonly answerService = inject(AnswerService);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly sanitizer = inject(DomSanitizer);

  readonly id = input.required<string>();

  protected readonly form = resource({
    params: () => this.id(),
    loader: ({ params }) => this.formService.get(params),
  });
  protected readonly screens = computed(() => (this.form.hasValue() ? this.buildScreens(this.form.value()) : []));
  protected readonly index = signal(0);
  protected readonly answers = signal<Record<string, AnswerValue | undefined>>({});
  protected readonly submitting = signal(false);

  protected readonly current = computed<Screen | undefined>(() => this.screens()[this.index()]);
  protected readonly isLast = computed(() => this.index() === this.screens().length - 1);
  protected readonly progress = computed(() => {
    const total = this.screens().length;
    return total ? ((this.index() + 1) / total) * 100 : 0;
  });
  protected readonly canContinue = computed(() => {
    const screen = this.current();
    if (!screen || this.submitting()) return false;
    if (screen.kind !== 'question') return true;
    const value = this.answers()[screen.step._id!];
    // Une adresse e-mail ou un numéro mal formé bloque, même sur une question facultative.
    if (isInvalid(screen.step, value)) return false;
    return screen.step.content.optional || isAnswered(screen.step, value);
  });
  /** Question facultative laissée vide : le bouton propose de la passer. */
  protected readonly canSkip = computed(() => {
    const screen = this.current();
    return (
      screen?.kind === 'question' &&
      !!screen.step.content.optional &&
      !isAnswered(screen.step, this.answers()[screen.step._id!]) &&
      !isInvalid(screen.step, this.answers()[screen.step._id!])
    );
  });

  constructor() {
    effect(() => {
      if (this.form.hasValue()) this.title.setTitle(`${this.form.value().title} · IdableForm`);
    });
  }

  protected setAnswer(step: Step, value: AnswerValue | undefined) {
    this.answers.update((answers) => ({ ...answers, [step._id!]: value }));

    // Comme sur Typeform : un choix unique fait passer automatiquement à l'écran suivant (sauf « Autre », à préciser).
    if ((step.content.type === 'yesno' || step.content.type === 'radio') && typeof value === 'string' && !this.isLast()) {
      const key = this.current()?.key;
      setTimeout(() => {
        if (this.current()?.key === key) this.next();
      }, 350);
    }
  }

  protected next() {
    if (!this.canContinue()) return;
    if (this.isLast()) {
      this.submit();
    } else {
      this.index.update((i) => i + 1);
    }
  }

  protected previous() {
    this.index.update((i) => Math.max(0, i - 1));
  }

  protected onEnter(event: Event) {
    const target = event.target as HTMLElement;
    // Dans l'éditeur de réponse libre, Entrée crée un nouveau paragraphe.
    if (target.closest('a, textarea, [contenteditable=true]')) return;
    const option = target.closest('[role=radio], [role=checkbox]');
    // Les autres boutons (Continuer, navigation) gardent leur comportement natif.
    if (target.closest('button') && !option) return;
    // Entrée sur une option pas encore choisie la sélectionne ; sur l'option choisie, elle valide.
    if (option?.getAttribute('role') === 'radio' && option.getAttribute('aria-checked') !== 'true') return;
    event.preventDefault();
    this.next();
  }

  private async submit() {
    const form = this.form.value();
    if (!form?._id) return;

    const formInstance = Date.now().toString();
    const answers: Answer[] = [];
    for (const screen of this.screens()) {
      const question = screen.step._id!;
      if (screen.kind === 'media' && screen.media) {
        // On enregistre quel média a été montré (choisi au hasard parmi les variantes).
        answers.push({ form: form._id, formInstance, question, answer: screen.media.name });
      } else if (screen.kind === 'question') {
        // Une question passée (facultative, ou choix multiples sans case cochée) n'est pas enregistrée :
        // les résultats ne comptent ainsi que les personnes concernées.
        const value = this.answers()[question];
        if (value === undefined || !hasContent(value)) continue;
        if (screen.step.content.type === 'open' && !isAnswered(screen.step, value)) continue;
        if (isOtherValue(value)) {
          answers.push({ form: form._id, formInstance, question, answer: value.other.trim() });
        } else if (isMultipleValue(value)) {
          const other = value.other?.trim();
          answers.push({ form: form._id, formInstance, question, answer: value.checked, ...(other ? { other } : {}) });
        } else {
          answers.push({ form: form._id, formInstance, question, answer: value });
        }
      }
    }

    this.submitting.set(true);
    try {
      await this.answerService.send(answers);
      this.router.navigate(['/thankyou'], { queryParams: { form: form._id } });
    } catch {
      this.submitting.set(false);
    }
  }

  private buildScreens(form: Form): Screen[] {
    const screens: Screen[] = [];
    let number = 0;

    const add = (step: Step, section?: Step) => {
      const key = step._id!;
      switch (step.content.type) {
        case 'media': {
          const medias = step.content.medias ?? [];
          const media = medias[Math.floor(Math.random() * medias.length)];
          if (!media) return;
          const embedUrl = media.isVideo
            ? this.sanitizer.bypassSecurityTrustResourceUrl(toEmbedUrl(media.url))
            : undefined;
          screens.push({ key, kind: 'media', step, section, media, embedUrl });
          return;
        }
        case 'section':
          screens.push({ key, kind: 'intro', step });
          (step.content.steps ?? []).forEach((child) => add(child, step));
          return;
        case 'text':
          screens.push({ key, kind: 'info', step, section });
          return;
        default:
          screens.push({ key, kind: 'question', step, section, number: ++number });
      }
    };

    form.steps.forEach((step) => add(step));
    return screens;
  }
}

function isAnswered(step: Step, value: AnswerValue | undefined): boolean {
  switch (step.content.type) {
    case 'multiple':
      // « Autre » coché demande un texte ; sinon aucune case n'est obligatoire.
      return !isMultipleValue(value) || value.other === undefined || value.other.trim() !== '';
    case 'jauge':
      return typeof value === 'number';
    case 'open':
      if (typeof value !== 'string') return false;
      if (step.content.format && step.content.format !== 'long') return value.trim() !== '' && !isInvalid(step, value);
      return htmlToText(value).trim() !== '';
    default:
      if (isOtherValue(value)) return value.other.trim() !== '';
      return typeof value === 'string' && value !== '';
  }
}

function isInvalid(step: Step, value: AnswerValue | undefined): boolean {
  return step.content.type === 'open' && typeof value === 'string' && isMalformed(step.content.format, value);
}

function hasContent(value: AnswerValue): boolean {
  if (isMultipleValue(value)) return value.checked.some(Boolean) || !!value.other?.trim();
  if (isOtherValue(value)) return value.other.trim() !== '';
  return typeof value === 'number' || value.trim() !== '';
}
