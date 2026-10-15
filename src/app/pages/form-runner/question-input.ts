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
      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50';
  }

  protected badgeClass(selected: boolean): string {
    return selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-stone-300 text-stone-500';
  }
}
