import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
        </nav>
      </div>
    </header>
  `,
})
export class SiteHeader {}
