import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { Bold, ClassicEditor, EditorConfig, Essentials, Heading, Italic, Link, List, Paragraph } from 'ckeditor5';
import translations from 'ckeditor5/translations/fr.js';
import { STEP_TYPES, Step, StepContent, StepType } from '../../core/models';

const ids = new WeakMap<object, number>();
let nextId = 0;

/** Identifiant stable par objet, pour suivre les étapes (même non enregistrées) dans les @for. */
function uid(item: object): number {
  if (!ids.has(item)) ids.set(item, nextId++);
  return ids.get(item)!;
}

/** Le CSS de CKEditor est un bundle à part (voir angular.json), chargé seulement dans l'éditeur. */
function loadEditorStyles(document: Document) {
  if (document.getElementById('ckeditor5-styles')) return;
  const link = document.createElement('link');
  link.id = 'ckeditor5-styles';
  link.rel = 'stylesheet';
  link.href = 'ckeditor5.css';
  document.head.appendChild(link);
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
  if (type === 'jauge') {
    content.borneBasse ??= '';
    content.borneHaute ??= '';
    content.disablable ??= false;
  }
}

@Component({
  selector: 'app-step-list',
  imports: [FormsModule, CKEditorModule],
  templateUrl: './step-list.html',
  // Le formulaire est un objet mutable édité via ngModel : on vérifie la vue à chaque cycle.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class StepList {
  readonly steps = input.required<Step[]>();
  /** Liste des sous-questions d'une partie (pas de partie imbriquée). */
  readonly nested = input(false);

  protected readonly uid = uid;
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
