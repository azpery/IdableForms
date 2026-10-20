import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiState } from '../../core/ui-state';

@Component({
  selector: 'app-thank-you',
  imports: [RouterLink],
  template: `
    <main class="flex min-h-dvh items-center justify-center px-4 py-16">
      <div class="w-full max-w-lg animate-screen-in text-center">
        <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <svg class="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 class="mt-8 text-4xl font-semibold tracking-tight">Merci pour votre participation !</h1>
        <p class="mt-4 text-lg leading-relaxed text-stone-600">
          Vos réponses ont bien été enregistrées. Elles contribuent directement à nos travaux de recherche.
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-3">
          <button type="button" class="btn btn-primary btn-lg" (click)="share()">Partager le questionnaire</button>
          <a routerLink="/" class="btn btn-secondary btn-lg">Voir les autres questionnaires</a>
        </div>
        <p class="mt-12 text-sm text-stone-500">
          Envie de lancer votre propre enquête ?
          <a routerLink="/signup" class="font-semibold text-brand-700 hover:underline">Créez votre questionnaire gratuitement</a>
        </p>
      </div>
    </main>
  `,
})
export class ThankYou {
  private readonly ui = inject(UiState);

  /** Identifiant du formulaire rempli (paramètre de requête `form`). */
  readonly form = input<string>();
  private readonly shareUrl = computed(() =>
    this.form() ? `${location.origin}/form/${this.form()}` : location.origin,
  );

  protected async share() {
    const url = this.shareUrl();
    if (navigator.share) {
      await navigator.share({ title: 'IdableForms', url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    this.ui.notify('Lien copié dans le presse-papiers');
  }
}
