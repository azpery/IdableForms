import { Component, ElementRef, afterNextRender, computed, input, output, viewChild } from '@angular/core';
import { AnswerValue, Step } from '../../core/models';

@Component({
  selector: 'app-question-input',
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

  private readonly openInput = viewChild<ElementRef<HTMLInputElement>>('openInput');

  constructor() {
    afterNextRender(() => this.openInput()?.nativeElement.focus());
  }

  protected isChecked(index: number): boolean {
    const value = this.value();
    return Array.isArray(value) && value[index];
  }

  protected toggle(index: number) {
    const value = this.value();
    const checked = Array.isArray(value) ? [...value] : (this.content().choices ?? []).map(() => false);
    checked[index] = !checked[index];
    this.valueChange.emit(checked);
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
