import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { UiState } from './ui-state';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const ui = inject(UiState);
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  if (token && req.url.startsWith(environment.apiUrl)) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  ui.startRequest();
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && (req.url === auth.loginUrl || req.url === auth.checkUrl)) {
        // Géré par la page de connexion (mauvais mot de passe) ou par le guard (jeton refusé).
      } else if (error.status === 401) {
        auth.logout();
        ui.notify('Votre session a expiré. Reconnectez-vous.', 'error');
        router.navigate(['/admin/login'], { queryParams: { redirect: router.url } });
      } else {
        ui.notify(errorMessage(error), 'error');
      }
      return throwError(() => error);
    }),
    finalize(() => ui.endRequest()),
  );
};

function errorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
  if (error.status === 404) return 'Ce formulaire est introuvable.';
  return error.error?.error ?? `Une erreur est survenue (code ${error.status}).`;
}
