import { Injectable, computed, signal } from '@angular/core';

export interface Toast {
  message: string;
  tone: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class UiState {
  private readonly pending = signal(0);
  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly loading = computed(() => this.pending() > 0);
  readonly toast = signal<Toast | null>(null);

  startRequest() {
    this.pending.update((n) => n + 1);
  }

  endRequest() {
    this.pending.update((n) => Math.max(0, n - 1));
  }

  notify(message: string, tone: Toast['tone'] = 'success') {
    clearTimeout(this.toastTimer);
    this.toast.set({ message, tone });
    this.toastTimer = setTimeout(() => this.toast.set(null), 4000);
  }
}
