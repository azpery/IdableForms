import { Component, computed, effect, inject, input, resource, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormService } from '../../core/form.service';
import { STEP_TYPES, StepType } from '../../core/models';
import { DayCount, ResponseColumn, ResponseRow, ResultsService, normalize } from '../../core/results';
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

  /** Filtres du tableau des réponses : recherche libre et une condition par question. */
  protected readonly search = signal('');
  protected readonly filters = signal<{ column: string; value: string }[]>([]);
  protected readonly NO_ANSWER = '\u0000aucune';

  protected readonly filteredRows = computed(() => {
    if (!this.data.hasValue()) return [];
    const { columns, rows } = this.data.value().results.responses;
    const terms = normalize(this.search()).split(/\s+/).filter(Boolean);
    const active = this.filters().filter((f) => f.value.trim());
    return rows.filter((row) => {
      const cells = Object.values(row.cells);
      if (!terms.every((t) => cells.some((c) => c.search.includes(t)))) return false;
      return active.every(({ column, value }) => {
        const cell = row.cells[column];
        const empty = !cell?.text.trim();
        if (value === this.NO_ANSWER) return empty;
        if (empty) return false;
        if (columns.find((c) => c.id === column)?.options) return !!cell.values?.includes(value);
        return cell.search.includes(normalize(value.trim()));
      });
    });
  });

  protected readonly filtering = computed(() => !!this.search().trim() || this.filters().some((f) => f.value.trim()));

  /** Colonnes non encore filtrées, proposées dans « Ajouter un filtre ». */
  protected readonly unfilteredColumns = computed(() => {
    if (!this.data.hasValue()) return [];
    const used = new Set(this.filters().map((f) => f.column));
    return this.data.value().results.responses.columns.filter((c) => !used.has(c.id));
  });

  /** Lignes dépliées pour voir les réponses en entier (ou toutes). */
  protected readonly expandAll = signal(false);
  protected readonly expanded = signal<Set<string>>(new Set());

  /** Largeurs des colonnes choisies à la souris, mémorisées par formulaire dans le navigateur. */
  protected readonly widths = signal<Record<string, number>>({});

  /** Participations cochées dans le tableau (identifiées par leur formInstance). */
  protected readonly emptySelection = new Set<string>();
  protected readonly selected = signal<Set<string>>(this.emptySelection);
  protected readonly deleting = signal(false);
  /** Seules les participations visibles (après filtres) comptent dans la sélection. */
  protected readonly visibleSelected = computed(() =>
    this.filteredRows().filter((r) => this.selected().has(r.instance)).map((r) => r.instance),
  );

  protected readonly formatPercent = formatPercent;
  protected readonly formatDecimal = formatDecimal;
  protected readonly formatShortDate = formatShortDate;
  protected readonly formatLongDate = formatLongDate;
  protected readonly formatRelative = formatRelative;

  constructor() {
    effect(() => {
      if (this.data.hasValue()) this.title.setTitle(`Résultats · ${this.data.value().form.title}`);
    });
    effect(() => {
      try {
        this.widths.set(JSON.parse(localStorage.getItem(this.widthsKey()) ?? '{}'));
      } catch {
        this.widths.set({});
      }
    });
  }

  private widthsKey() {
    return `results-widths:${this.id()}`;
  }

  protected column(id: string): ResponseColumn | undefined {
    return this.data.hasValue() ? this.data.value().results.responses.columns.find((c) => c.id === id) : undefined;
  }

  protected addFilter(column: string) {
    if (column) this.filters.update((f) => [...f, { column, value: '' }]);
  }

  protected setFilter(index: number, value: string) {
    this.filters.update((f) => f.map((filter, i) => (i === index ? { ...filter, value } : filter)));
  }

  protected removeFilter(index: number) {
    this.filters.update((f) => f.filter((_, i) => i !== index));
  }

  protected clearFilters() {
    this.search.set('');
    this.filters.set([]);
  }

  protected isExpanded(row: ResponseRow): boolean {
    return this.expandAll() || this.expanded().has(row.instance);
  }

  protected toggleExpanded(row: ResponseRow, event: Event) {
    // Ne pas replier quand on sélectionne du texte ou qu'on clique un lien.
    if (window.getSelection()?.toString() || (event.target as HTMLElement).closest('a')) return;
    const next = new Set(this.expanded());
    if (!next.delete(row.instance)) next.add(row.instance);
    this.expanded.set(next);
  }

  /** Redimensionnement d'une colonne en faisant glisser le bord droit de son en-tête. */
  protected startResize(event: PointerEvent, column: string) {
    event.preventDefault();
    const handle = event.target as HTMLElement;
    const th = handle.closest('th')!;
    const startX = event.clientX;
    const startWidth = th.offsetWidth;
    handle.setPointerCapture(event.pointerId);
    const move = (e: PointerEvent) => {
      this.widths.update((w) => ({ ...w, [column]: Math.max(96, Math.round(startWidth + e.clientX - startX)) }));
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      this.saveWidths();
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  protected resizeBy(column: string, delta: number, event: Event) {
    event.preventDefault();
    const th = (event.target as HTMLElement).closest('th')!;
    this.widths.update((w) => ({ ...w, [column]: Math.max(96, (w[column] ?? th.offsetWidth) + delta) }));
    this.saveWidths();
  }

  protected resetWidth(column: string) {
    this.widths.update(({ [column]: _, ...rest }) => rest);
    this.saveWidths();
  }

  private saveWidths() {
    try {
      localStorage.setItem(this.widthsKey(), JSON.stringify(this.widths()));
    } catch {
      // Stockage indisponible (navigation privée…) : les largeurs ne sont simplement pas mémorisées.
    }
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
    const instances = this.visibleSelected();
    const count = instances.length;
    if (!confirm(`Supprimer ${count} participation${count > 1 ? 's' : ''} ? Leurs réponses seront définitivement effacées.`)) return;
    this.removeParticipations(instances);
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
