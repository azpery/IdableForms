import { Component, ElementRef, afterNextRender, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SiteHeader } from '../../shared/site-header';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, SiteHeader],
  template: `
    <app-site-header />
    <main class="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-16">
      <form class="w-full max-w-sm animate-screen-in" (ngSubmit)="submit()">
        <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h1 class="mt-6 text-center text-2xl font-semibold tracking-tight">Administration</h1>
        <p class="mt-2 text-center text-sm text-stone-500">Saisissez le mot de passe pour gérer les formulaires.</p>

        <label class="mt-8 block">
          <span class="label">Mot de passe</span>
          <input
            #passwordInput
            type="password"
            name="password"
            autocomplete="current-password"
            class="input"
            [class.!border-red-400]="error()"
            [(ngModel)]="password"
            required
          />
        </label>
        @if (error()) {
          <p class="mt-2 text-sm text-red-600" role="alert">{{ error() }}</p>
        }

        <button type="submit" class="btn btn-primary mt-6 w-full" [disabled]="loading() || !password">
          {{ loading() ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </main>
  `,
})
export class AdminLogin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Page demandée avant la redirection vers la connexion (paramètre de requête). */
  readonly redirect = input<string>();

  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  private readonly passwordInput = viewChild<ElementRef<HTMLInputElement>>('passwordInput');

  constructor() {
    if (this.auth.isLoggedIn()) this.router.navigateByUrl(this.target());
    afterNextRender(() => this.passwordInput()?.nativeElement.focus());
  }

  protected async submit() {
    if (!this.password || this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.login(this.password);
      this.router.navigateByUrl(this.target());
    } catch (e) {
      if ((e as HttpErrorResponse).status === 401) this.error.set('Mot de passe incorrect.');
      this.password = '';
      this.passwordInput()?.nativeElement.focus();
    } finally {
      this.loading.set(false);
    }
  }

  private target(): string {
    const redirect = this.redirect();
    // On n'accepte qu'un chemin interne.
    return redirect?.startsWith('/') && !redirect.startsWith('//') ? redirect : '/admin/forms';
  }
}
