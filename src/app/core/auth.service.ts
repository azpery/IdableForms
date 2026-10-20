import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface Session {
  token: string;
  expiresAt: string;
  user: User;
}

const STORAGE_KEY = 'idable-session';

function readStoredSession(): Session | null {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Session | null;
    return session && new Date(session.expiresAt).getTime() > Date.now() ? session : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = signal(readStoredSession());
  /** Dernier jeton confirmé par le serveur, pour ne le vérifier qu'une fois. */
  private verifiedToken: string | null = null;

  private readonly url = `${environment.apiUrl}/api/auth`;
  /** Requêtes dont le 401 est géré par l'appelant (mauvais identifiants, session refusée). */
  readonly silentUrls = [`${this.url}/login`, `${this.url}/signup`, `${this.url}/me`, `${this.url}/logout`];

  readonly user = computed(() => this.session()?.user ?? null);
  readonly isLoggedIn = computed(() => !!this.session());

  getToken(): string | null {
    return this.session()?.token ?? null;
  }

  /** Vérifie auprès du serveur que la session est toujours valide, et rafraîchit le profil. */
  async verify(): Promise<boolean> {
    const session = this.session();
    if (!session) return false;
    if (session.token === this.verifiedToken) return true;
    try {
      const { user } = await firstValueFrom(this.http.get<{ user: User }>(`${this.url}/me`));
      this.store({ ...session, user });
      this.verifiedToken = session.token;
      return true;
    } catch {
      return false;
    }
  }

  async login(email: string, password: string): Promise<void> {
    this.open(await firstValueFrom(this.http.post<Session>(`${this.url}/login`, { email, password })));
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    this.open(await firstValueFrom(this.http.post<Session>(`${this.url}/signup`, { name, email, password })));
  }

  /** Révoque la session côté serveur (sans attendre) et l'oublie localement. */
  logout() {
    const token = this.getToken();
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      firstValueFrom(this.http.post(`${this.url}/logout`, {}, { headers })).catch(() => undefined);
    }
    this.store(null);
  }

  /** Oublie la session locale sans prévenir le serveur (jeton déjà refusé). */
  forget() {
    this.store(null);
  }

  private open(session: Session) {
    this.store(session);
    this.verifiedToken = session.token;
  }

  private store(session: Session | null) {
    this.session.set(session);
    try {
      if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Stockage indisponible (navigation privée) : la session ne durera que le temps de l'onglet.
    }
  }
}
