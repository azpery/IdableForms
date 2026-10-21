import { Component, ElementRef, computed, input, output, viewChild } from '@angular/core';
import { AnswerValue, MultipleValue, Step, isMultipleValue, isOtherValue } from '../../core/models';
import { RichAnswer } from './rich-answer';

@Component({
  selector: 'app-question-input',
  imports: [RichAnswer],
  templateUrl: './question-input.html',
})
export class QuestionInput {
  readonly step = input.required<Step>();
  readonly value = input<AnswerValue>();
  readonly valueChange = output<AnswerValue | undefined>();

  protected readonly letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  protected readonly scale = [1, 2, 3, 4, 5];
  protected readonly content = computed(() => this.step().content);
  protected readonly alreadyDoing = computed(() => this.value() === -1);

  private readonly otherInput = viewChild<ElementRef<HTMLInputElement>>('otherInput');

  /** Réponse actuelle d'un choix multiple (rien de coché par défaut). */
  protected readonly multiple = computed<MultipleValue>(() => {
    const value = this.value();
    if (isMultipleValue(value)) return value;
    return { checked: (this.content().choices ?? []).map(() => false) };
  });
  protected readonly otherChecked = computed(() => this.multiple().other !== undefined);
  /** Choix unique : texte de « Autre » s'il est choisi (undefined sinon). */
  protected readonly radioOther = computed(() => {
    const value = this.value();
    return isOtherValue(value) ? value.other : undefined;
  });

  protected isChecked(index: number): boolean {
    return !!this.multiple().checked[index];
  }

  protected toggle(index: number) {
    const checked = [...this.multiple().checked];
    checked[index] = !checked[index];
    this.valueChange.emit({ ...this.multiple(), checked });
  }

  protected toggleOther() {
    const { checked, other } = this.multiple();
    this.valueChange.emit(other === undefined ? { checked, other: '' } : { checked });
    if (other === undefined) setTimeout(() => this.otherInput()?.nativeElement.focus());
  }

  protected setOther(other: string) {
    this.valueChange.emit({ ...this.multiple(), other });
  }

  protected selectRadioOther() {
    if (this.radioOther() !== undefined) return;
    this.valueChange.emit({ other: '' });
    setTimeout(() => this.otherInput()?.nativeElement.focus());
  }

  protected setRadioOther(other: string) {
    this.valueChange.emit({ other });
  }

  protected setAlreadyDoing(checked: boolean) {
    this.valueChange.emit(checked ? -1 : undefined);
  }

  protected optionClass(selected: boolean): string {
    return selected
      ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-400/60'
      : 'border-stone-200 bg-white hover:border-brand-200 hover:bg-white hover:shadow-sm';
  }

  /** Pastilles de lettre : une couleur Wopopop par réponse, pleine une fois choisie. */
  private readonly badgeTones = [
    'border-coral/40 bg-coral/10 text-coral-ink',
    'border-saffron/50 bg-saffron/15 text-saffron-ink',
    'border-orchid/40 bg-orchid/10 text-orchid-ink',
    'border-lagoon/40 bg-lagoon/10 text-lagoon-ink',
  ];

  protected badgeClass(selected: boolean, index: number): string {
    return selected ? 'border-transparent bg-gradient-cta text-white' : this.badgeTones[index % this.badgeTones.length];
  }
}
