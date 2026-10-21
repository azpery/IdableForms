import { DOCUMENT } from '@angular/common';
import { Component, OnInit, inject, input, output } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { Autoformat, Bold, ClassicEditor, EditorConfig, Essentials, Italic, List, Paragraph } from 'ckeditor5';
import translations from 'ckeditor5/translations/fr.js';
import { loadEditorStyles } from '../../shared/rich-text';

/** Réponse libre mise en forme (gras, italique, listes). Chargée à la demande : CKEditor est volumineux. */
@Component({
  selector: 'app-rich-answer',
  imports: [CKEditorModule],
  template: `
    <div class="rich-answer">
      <ckeditor [editor]="Editor" [config]="config" [data]="initial" (ready)="$event.editing.view.focus()" (change)="valueChange.emit($event.editor.getData())" />
    </div>
  `,
})
export class RichAnswer implements OnInit {
  readonly value = input<string>('');
  readonly label = input<string>('');
  readonly valueChange = output<string>();

  /** Contenu de départ seulement : le renvoyer à chaque frappe ferait sauter le curseur. */
  protected initial = '';

  protected readonly Editor = ClassicEditor;
  protected config: EditorConfig = {};

  constructor() {
    loadEditorStyles(inject(DOCUMENT));
  }

  ngOnInit() {
    this.initial = this.value();
    this.config = {
      licenseKey: 'GPL',
      language: 'fr',
      translations,
      // Autoformat : « - » ou « 1. » en début de ligne crée une liste, **texte** met en gras
      plugins: [Essentials, Paragraph, Bold, Italic, List, Autoformat],
      toolbar: ['bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
      placeholder: 'Votre réponse…',
      label: this.label(),
    };
  }
}
