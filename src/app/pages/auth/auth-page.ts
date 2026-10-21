import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, afterNextRender, computed, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SiteHeader } from '../../shared/site-header';

/** Connexion et création de compte (mode choisi par la route). */
@Component({
  selector: 'app-auth-page',
  imports: [FormsModule, RouterLink, SiteHeader],
  template: `
    <app-site-header />
    <main class="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute top-[-6rem] right-[15%] size-[22rem] rounded-full bg-orchid/25 blur-3xl"></div>
        <div class="absolute bottom-[-6rem] left-[15%] size-[22rem] rounded-full bg-saffron/25 blur-3xl"></div>
      </div>
      <form class="w-full max-w-sm animate-screen-in rounded-2xl border border-white/70 bg-white/75 p-8 shadow-xl shadow-orchid/10 backdrop-blur" (ngSubmit)="submit()">
        <img src="assets/logo.svg" alt="" class="mx-auto size-12" />
        <h1 class="mt-6 text-center text-3xl font-bold tracking-tight">
          {{ isSignup() ? 'Créer un compte' : 'Connexion' }}
        </h1>
        <p class="mt-2 text-center text-sm text-stone-500">
          {{ isSignup() ? 'Gratuit, et vos premiers questionnaires en quelques minutes.' : 'Retrouvez vos questionnaires et leurs résultats.' }}
        </p>

        <div class="mt-8 space-y-4">
          @if (isSignup()) {
            <label class="block">
              <span class="label">Nom</span>
              <input #firstInput name="name" autocomplete="name" class="input" maxlength="100" [(ngModel)]="name" required />
            </label>
          }
          <label class="block">
            <span class="label">E-mail</span>
            <input
              #emailInput
              type="email"
              name="email"
              autocomplete="email"
              class="input"
              [(ngModel)]="email"
              required
            />
          </label>
          <label class="block">
            <span class="label">Mot de passe</span>
            <input
              #passwordInput
              type="password"
              name="password"
              [attr.autocomplete]="isSignup() ? 'new-password' : 'current-password'"
              [attr.minlength]="isSignup() ? 8 : null"
              class="input"
              [class.!border-red-400]="error()"
              [(ngModel)]="password"
              required
            />
            @if (isSignup()) {
              <span class="mt-1.5 block text-xs text-stone-500">8 caractères minimum.</span>
            }
          </label>
        </div>

        @if (error()) {
          <p class="mt-4 text-sm text-red-600" role="alert">{{ error() }}</p>
        }

        <button type="submit" class="btn btn-primary mt-6 w-full" [disabled]="loading() || !canSubmit()">
          @if (loading()) {
            {{ isSignup() ? 'Création…' : 'Connexion…' }}
          } @else {
            {{ isSignup() ? 'Créer mon compte' : 'Se connecter' }}
          }
        </button>

        <p class="mt-6 text-center text-sm text-stone-500">
          @if (isSignup()) {
            Déjà un compte ?
            <a routerLink="/login" [queryParams]="{ redirect: redirect() }" class="font-semibold text-coral-ink hover:underline">Se connecter</a>
          } @else {
            Pas encore de compte ?
            <a routerLink="/signup" [queryParams]="{ redirect: redirect() }" class="font-semibold text-coral-ink hover:underline">Créer un compte</a>
          }
        </p>
      </form>
    </main>
  `,
})
export class AuthPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** `signup` ou `login` (donnée de route). */
  readonly mode = input<'login' | 'signup'>('login');
  /** Page demandée avant la redirection vers la connexion (paramètre de requête). */
  readonly redirect = input<string>();

  protected readonly isSignup = computed(() => this.mode() === 'signup');
  protected name = '';
  protected email = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  private readonly firstInput = viewChild<ElementRef<HTMLInputElement>>('firstInput');
  private readonly emailInput = viewChild<ElementRef<HTMLInputElement>>('emailInput');
  private readonly passwordInput = viewChild<ElementRef<HTMLInputElement>>('passwordInput');

  constructor() {
    if (this.auth.isLoggedIn()) this.router.navigateByUrl(this.target());
    afterNextRender(() => (this.firstInput() ?? this.emailInput())?.nativeElement.focus());
  }

  protected canSubmit(): boolean {
    if (!this.email.trim() || !this.password) return false;
    return !this.isSignup() || (!!this.name.trim() && this.password.length >= 8);
  }

  protected async submit() {
    if (!this.canSubmit() || this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    try {
      if (this.isSignup()) await this.auth.signup(this.name.trim(), this.email.trim(), this.password);
      else await this.auth.login(this.email.trim(), this.password);
      this.router.navigateByUrl(this.target());
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.error.set(error.error?.error ?? 'Une erreur est survenue. Réessayez.');
      if (error.status === 401) {
        this.password = '';
        this.passwordInput()?.nativeElement.focus();
      }
    } finally {
      this.loading.set(false);
    }
  }

  private target(): string {
    const redirect = this.redirect();
    // On n'accepte qu'un chemin interne.
    return redirect?.startsWith('/') && !redirect.startsWith('//') ? redirect : '/forms';
  }
}
