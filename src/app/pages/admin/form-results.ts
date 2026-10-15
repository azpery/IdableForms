import { Component, computed, effect, inject, input, resource } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormService } from '../../core/form.service';
import { STEP_TYPES, StepType } from '../../core/models';
import { DayCount, ResultsService } from '../../core/results';
import { formatDecimal, formatLongDate, formatPercent, formatRelative, formatShortDate } from '../../shared/format';
import { SiteHeader } from '../../shared/site-header';
import { BarList } from './bar-list';

/** Arrondit au-dessus vers une graduation lisible dont la moitié est entière (2, 4, 6, 8, 10, 20…). */
function niceMax(value: number): number {
  if (value <= 4) return Math.max(2, Math.ceil(value / 2) * 2);
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 4, 6, 8, 10].find((s) => s * magnitude >= value)!;
  return step * magnitude;
}

@Component({
  selector: 'app-form-results',
  imports: [RouterLink, SiteHeader, BarList],
  templateUrl: './form-results.html',
})
export class FormResults {
  private readonly formService = inject(FormService);
  private readonly resultsService = inject(ResultsService);
  private readonly title = inject(Title);

  readonly id = input.required<string>();

  protected readonly data = resource({
    params: () => this.id(),
    loader: async ({ params }) => {
      const form = await this.formService.get(params);
      return { form, results: await this.resultsService.load(form) };
    },
  });

  /** Échelle de l'histogramme des participations : maximum arrondi et graduations. */
  protected readonly timeline = computed(() => {
    if (!this.data.hasValue()) return null;
    const days = this.data.value().results.perDay;
    const max = niceMax(Math.max(1, ...days.map((d) => d.count)));
    return { days, max, ticks: [max, max / 2, 0], middle: days[Math.floor((days.length - 1) / 2)].date };
  });

  protected readonly formatPercent = formatPercent;
  protected readonly formatDecimal = formatDecimal;
  protected readonly formatShortDate = formatShortDate;
  protected readonly formatLongDate = formatLongDate;
  protected readonly formatRelative = formatRelative;

  constructor() {
    effect(() => {
      if (this.data.hasValue()) this.title.setTitle(`Résultats · ${this.data.value().form.title}`);
    });
  }

  protected typeLabel(type: StepType): string {
    return type === 'media' ? 'Variante de média affichée' : (STEP_TYPES.find((t) => t.value === type)?.label ?? '');
  }

  protected downloadCsv() {
    if (this.data.hasValue()) this.formService.downloadCsv(this.data.value().form);
  }

  protected dayLabel(day: DayCount): string {
    const n = day.count;
    return `${formatShortDate(day.date)} · ${n} participation${n > 1 ? 's' : ''}`;
  }

  /** Aligne l'infobulle sur le bord pour les premières et dernières colonnes. */
  protected tooltipAlign(index: number, total: number): string {
    if (index < 3) return 'left-0';
    if (index > total - 4) return 'right-0';
    return 'left-1/2 -translate-x-1/2';
  }

  protected scaleHeight(count: number, counts: { count: number }[]): number {
    const max = Math.max(1, ...counts.map((c) => c.count));
    return (count / max) * 100;
  }
}
