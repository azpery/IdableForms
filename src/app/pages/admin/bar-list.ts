import { Component, input } from '@angular/core';
import { Bar } from '../../core/results';
import { formatPercent } from '../../shared/format';

/** Barres horizontales : la réponse majoritaire est mise en avant, les autres restent en retrait. */
@Component({
  selector: 'app-bar-list',
  template: `
    <ul class="space-y-3.5">
      @for (bar of bars(); track bar.label; let i = $index) {
        <li class="group">
          <div class="flex items-baseline justify-between gap-4 text-sm">
            <span class="text-stone-700" [class.font-medium]="bar.leader" [class.text-stone-900]="bar.leader">{{ bar.label }}</span>
            <span class="shrink-0 tabular-nums">
              <span class="font-semibold text-stone-900">{{ formatPercent(bar.share) }}</span>
              <span class="ml-1.5 text-stone-400">{{ bar.count }}</span>
            </span>
          </div>
          <div class="mt-1.5 h-2.5 overflow-hidden rounded-full bg-stone-100">
            <div
              class="h-full origin-left animate-grow-x rounded-full transition-colors"
              [class]="bar.leader ? 'bg-brand-500 group-hover:bg-brand-600' : 'bg-stone-400 group-hover:bg-stone-500'"
              [style.width.%]="bar.share"
              [style.animation-delay.ms]="i * 60"
            ></div>
          </div>
        </li>
      }
    </ul>
  `,
})
export class BarList {
  readonly bars = input.required<Bar[]>();
  protected readonly formatPercent = formatPercent;
}
