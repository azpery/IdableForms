import { Component, computed, effect, inject, input, resource, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormService } from '../../core/form.service';
import { STEP_TYPES, StepType } from '../../core/models';
import { DayCount, ResponseRow, ResultsService } from '../../core/results';
import { UiState } from '../../core/ui-state';
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
  private readonly ui = inject(UiState);

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

  protected readonly tabs = [
    { value: 'summary', label: 'Synthèse' },
    { value: 'responses', label: 'Réponses' },
  ] as const;
  protected readonly tab = signal<'summary' | 'responses'>('summary');

  /** Participations cochées dans le tableau (identifiées par leur formInstance). */
  protected readonly emptySelection = new Set<string>();
  protected readonly selected = signal<Set<string>>(this.emptySelection);
  protected readonly deleting = signal(false);

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

  protected toggle(instance: string) {
    const next = new Set(this.selected());
    if (!next.delete(instance)) next.add(instance);
    this.selected.set(next);
  }

  protected toggleAll(rows: ResponseRow[], checked: boolean) {
    this.selected.set(checked ? new Set(rows.map((r) => r.instance)) : this.emptySelection);
  }

  protected remove(row: ResponseRow) {
    if (!confirm(`Supprimer la participation du ${formatLongDate(row.date)} ? Ses réponses seront définitivement effacées.`)) return;
    this.removeParticipations([row.instance]);
  }

  protected removeSelected() {
    const count = this.selected().size;
    if (!confirm(`Supprimer ${count} participation${count > 1 ? 's' : ''} ? Leurs réponses seront définitivement effacées.`)) return;
    this.removeParticipations([...this.selected()]);
  }

  private async removeParticipations(instances: string[]) {
    if (!this.data.hasValue()) return;
    this.deleting.set(true);
    try {
      await this.resultsService.removeParticipations(this.data.value().form._id!, instances);
      const n = instances.length;
      this.ui.notify(n > 1 ? `${n} participations supprimées` : 'Participation supprimée');
      this.selected.set(this.emptySelection);
      this.data.reload();
    } finally {
      this.deleting.set(false);
    }
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
