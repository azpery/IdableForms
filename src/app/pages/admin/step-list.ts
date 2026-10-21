import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { Bold, ClassicEditor, EditorConfig, Essentials, Heading, Italic, Link, List, Paragraph } from 'ckeditor5';
import translations from 'ckeditor5/translations/fr.js';
import { OPEN_FORMATS, STEP_TYPES, Step, StepContent, StepType } from '../../core/models';
import { loadEditorStyles } from '../../shared/rich-text';

const ids = new WeakMap<object, number>();
let nextId = 0;

/** Identifiant stable par objet, pour suivre les étapes (même non enregistrées) dans les @for. */
function uid(item: object): number {
  if (!ids.has(item)) ids.set(item, nextId++);
  return ids.get(item)!;
}

export function newStep(): Step {
  return { step: 0, content: { type: 'yesno', title: '' } };
}

/** Ajoute les champs nécessaires au nouveau type, sans effacer ceux déjà saisis. */
function prepareContent(content: StepContent, type: StepType) {
  content.type = type;
  if ((type === 'radio' || type === 'multiple') && !content.choices?.length) content.choices = ['', ''];
  if (type === 'media' && !content.medias?.length) content.medias = [{ name: '', url: '', isVideo: true }];
  if (type === 'section') content.steps ??= [];
  if (type === 'text') content.body ??= '';
  if (type === 'open') content.format ??= 'long';
  if (type === 'jauge') {
    content.borneBasse ??= '';
    content.borneHaute ??= '';
    content.disablable ??= false;
  }
}

@Component({
  selector: 'app-step-list',
  imports: [FormsModule, CKEditorModule, NgTemplateOutlet],
  templateUrl: './step-list.html',
  // Le formulaire est un objet mutable édité via ngModel : on vérifie la vue à chaque cycle.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class StepList {
  readonly steps = input.required<Step[]>();
  /** Liste des sous-questions d'une partie (pas de partie imbriquée). */
  readonly nested = input(false);

  protected readonly uid = uid;
  protected readonly openFormats = OPEN_FORMATS;
  protected readonly types = computed(() => STEP_TYPES.filter((t) => !this.nested() || t.value !== 'section'));

  protected readonly Editor = ClassicEditor;
  protected readonly editorConfig: EditorConfig = {
    licenseKey: 'GPL',
    language: 'fr',
    translations,
    plugins: [Essentials, Paragraph, Heading, Bold, Italic, Link, List],
    toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
  };

  constructor() {
    loadEditorStyles(inject(DOCUMENT));
  }

  protected add(index: number) {
    this.steps().splice(index, 0, newStep());
  }

  protected remove(index: number) {
    const step = this.steps()[index];
    if (step.content.title && !confirm(`Supprimer « ${step.content.title} » ?`)) return;
    this.steps().splice(index, 1);
  }

  protected move(index: number, offset: number) {
    const steps = this.steps();
    const target = index + offset;
    if (target < 0 || target >= steps.length) return;
    [steps[index], steps[target]] = [steps[target], steps[index]];
  }

  /** Déplace un choix proposé de la position `from` à la position `to`. */
  protected moveChoice(step: Step, from: number, to: number) {
    const choices = step.content.choices!;
    if (to < 0 || to >= choices.length || to === from) return;
    const [choice] = choices.splice(from, 1);
    choices.splice(to, 0, choice);
  }

  // Glisser-déposer des choix : la ligne ne devient déplaçable que quand on saisit sa poignée,
  // pour ne pas gêner la sélection de texte dans le champ.
  protected grabbed?: { step: Step; index: number };
  protected dragged?: { step: Step; index: number };
  protected dropTarget?: { step: Step; index: number };

  protected isGrabbed(step: Step, index: number): boolean {
    return this.grabbed?.step === step && this.grabbed.index === index;
  }

  protected isDragged(step: Step, index: number): boolean {
    return this.dragged?.step === step && this.dragged.index === index;
  }

  protected isDropTarget(step: Step, index: number): boolean {
    return this.dropTarget?.step === step && this.dropTarget.index === index && !this.isDragged(step, index);
  }

  protected startDrag(step: Step, index: number, event: DragEvent) {
    this.dragged = { step, index };
    event.dataTransfer?.setData('text/plain', String(index));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  protected dragOver(step: Step, index: number, event: DragEvent) {
    // On n'accepte que les choix de la même question.
    if (this.dragged?.step !== step) return;
    event.preventDefault();
    this.dropTarget = { step, index };
  }

  protected drop(step: Step, index: number, event: DragEvent) {
    event.preventDefault();
    if (this.dragged?.step === step) this.moveChoice(step, this.dragged.index, index);
    this.endDrag();
  }

  protected endDrag() {
    this.grabbed = this.dragged = this.dropTarget = undefined;
  }

  protected changeType(step: Step, type: StepType) {
    prepareContent(step.content, type);
  }

  /** Questions qui peuvent être rendues facultatives (les choix multiples le sont déjà). */
  protected canBeOptional(step: Step): boolean {
    return ['yesno', 'radio', 'jauge', 'open'].includes(step.content.type);
  }

  protected hasChoices(step: Step): boolean {
    return step.content.type === 'radio' || step.content.type === 'multiple';
  }

  protected titlePlaceholder(step: Step): string {
    switch (step.content.type) {
      case 'section':
        return 'Ex. : Vos habitudes au quotidien';
      case 'media':
        return 'Ex. : Introduction';
      case 'text':
        return 'Ex. : Le saviez-vous ?';
      default:
        return 'Ex. : Triez-vous vos déchets ?';
    }
  }
}
