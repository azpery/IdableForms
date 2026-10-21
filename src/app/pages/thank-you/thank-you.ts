import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiState } from '../../core/ui-state';

@Component({
  selector: 'app-thank-you',
  imports: [RouterLink],
  template: `
    <main class="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-16">
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute top-[-8rem] left-[10%] size-[24rem] rounded-full bg-coral/25 blur-3xl"></div>
        <div class="absolute top-[20%] right-[-6rem] size-[22rem] rounded-full bg-orchid/30 blur-3xl"></div>
        <div class="absolute bottom-[-8rem] left-[30%] size-[24rem] rounded-full bg-lagoon/25 blur-3xl"></div>
      </div>
      <div class="w-full max-w-lg animate-screen-in text-center">
        <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-cta text-white shadow-lg shadow-orchid/30">
          <svg class="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 class="mt-8 text-4xl font-bold tracking-tight sm:text-5xl"><span class="text-gradient">Merci</span> pour votre participation !</h1>
        <p class="mt-4 text-lg leading-relaxed text-stone-600">
          Vos réponses ont bien été enregistrées. Elles contribuent directement à nos travaux de recherche.
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-3">
          <button type="button" class="btn btn-primary btn-lg" (click)="share()">Partager le questionnaire</button>
          <a routerLink="/" class="btn btn-secondary btn-lg bg-white/70">Voir les autres questionnaires</a>
        </div>
        <p class="mt-12 text-sm text-stone-500">
          Envie de lancer votre propre enquête ?
          <a routerLink="/signup" class="font-semibold text-coral-ink hover:underline">Créez votre questionnaire gratuitement</a>
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
