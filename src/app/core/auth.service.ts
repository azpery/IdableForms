import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'idable-admin-token';

/** Jeton de la forme `<expiration en ms>.<signature>`, délivré par l'API. */
function isUnexpired(token: string | null): token is string {
  return !!token && Number(token.split('.')[0]) > Date.now();
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly token = signal(readStoredToken());
  /** Dernier jeton confirmé par le serveur, pour ne le vérifier qu'une fois. */
  private verifiedToken: string | null = null;

  readonly loginUrl = `${environment.apiUrl}/api/admin/login`;
  readonly checkUrl = `${environment.apiUrl}/api/admin/check`;
  readonly isLoggedIn = computed(() => isUnexpired(this.token()));

  getToken(): string | null {
    const token = this.token();
    return isUnexpired(token) ? token : null;
  }

  /** Vérifie auprès du serveur que le jeton est toujours accepté (mot de passe inchangé, signature valide). */
  async verify(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    if (token === this.verifiedToken) return true;
    try {
      await firstValueFrom(this.http.get(this.checkUrl));
      this.verifiedToken = token;
      return true;
    } catch {
      return false;
    }
  }

  async login(password: string): Promise<void> {
    const { token } = await firstValueFrom(this.http.post<{ token: string }>(this.loginUrl, { password }));
    this.setToken(token);
    this.verifiedToken = token;
  }

  logout() {
    this.setToken(null);
  }

  private setToken(token: string | null) {
    this.token.set(token);
    try {
      if (token) localStorage.setItem(STORAGE_KEY, token);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Stockage indisponible (navigation privée) : la session ne durera que le temps de l'onglet.
    }
  }
}
