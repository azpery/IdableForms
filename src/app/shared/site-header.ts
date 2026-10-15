import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-30 border-b border-stone-200/70 bg-white/80 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a routerLink="/" class="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight" aria-label="IdableForms, accueil">
          <img src="assets/green.svg" alt="" class="size-8" />
          <span class="hidden min-[440px]:inline">IdableForms</span>
        </a>
        <nav class="flex items-center gap-1 text-sm font-medium">
          <a
            routerLink="/"
            routerLinkActive="!bg-stone-100 !text-stone-900"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-lg px-3 py-2 text-stone-500 transition hover:text-stone-900"
            >Questionnaires</a
          >
          <a
            routerLink="/admin/forms"
            routerLinkActive="!bg-stone-100 !text-stone-900"
            class="rounded-lg px-3 py-2 text-stone-500 transition hover:text-stone-900"
            >Administration</a
          >
          @if (auth.isLoggedIn()) {
            <button
              type="button"
              class="rounded-lg px-3 py-2 text-stone-500 transition hover:text-stone-900"
              title="Se déconnecter de l'administration"
              (click)="logout()"
            >
              <span class="hidden sm:inline">Déconnexion</span>
              <svg class="size-4 sm:hidden" viewBox="0 0 20 20" fill="currentColor" aria-label="Déconnexion"><path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clip-rule="evenodd" /></svg>
            </button>
          }
        </nav>
      </div>
    </header>
  `,
})
export class SiteHeader {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
