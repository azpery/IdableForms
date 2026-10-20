import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FormService } from '../../core/form.service';
import { Form, Step } from '../../core/models';
import { UiState } from '../../core/ui-state';
import { SiteHeader } from '../../shared/site-header';
import { StepList } from './step-list';

@Component({
  selector: 'app-form-editor',
  imports: [FormsModule, RouterLink, SiteHeader, StepList],
  templateUrl: './form-editor.html',
  // Le formulaire est un objet mutable édité via ngModel : on vérifie la vue à chaque cycle.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class FormEditor implements OnInit {
  private readonly formService = inject(FormService);
  private readonly router = inject(Router);
  private readonly ui = inject(UiState);
  protected readonly auth = inject(AuthService);

  /** Absent pour un nouveau formulaire. */
  readonly id = input<string>();

  protected form: Form = { title: 'Nouveau formulaire', description: '', imgUrl: '', steps: [] };
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);

  async ngOnInit() {
    const id = this.id();
    if (!id) return;
    this.loading.set(true);
    try {
      this.form = await this.formService.get(id);
    } finally {
      this.loading.set(false);
    }
  }

  protected async save() {
    const error = validate(this.form);
    if (error) {
      this.ui.notify(error, 'error');
      return;
    }

    const isNew = !this.form._id;
    this.saving.set(true);
    try {
      this.form = await this.formService.save(this.form);
      this.ui.notify('Formulaire enregistré');
      if (isNew) this.router.navigate(['/form/edit', this.form._id], { replaceUrl: true });
    } finally {
      this.saving.set(false);
    }
  }
}

function validate(form: Form): string | null {
  if (!form.title.trim()) return 'Le formulaire doit avoir un titre.';

  const check = (steps: Step[], prefix: string): string | null => {
    for (const [index, step] of steps.entries()) {
      const label = `${prefix}${index + 1}`;
      const { content } = step;
      if (!content.title.trim()) return `L'étape ${label} n'a pas de titre.`;
      if ((content.type === 'radio' || content.type === 'multiple') && !content.choices?.some((c) => c.trim())) {
        return `L'étape ${label} doit proposer au moins un choix.`;
      }
      if (content.type === 'media' && !content.medias?.some((m) => m.url.trim())) {
        return `L'étape ${label} doit contenir au moins un média avec une URL.`;
      }
      if (content.type === 'section') {
        const error = check(content.steps ?? [], `${label}.`);
        if (error) return error;
      }
    }
    return null;
  };
  return check(form.steps, '');
}
