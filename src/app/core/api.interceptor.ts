import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { UiState } from './ui-state';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const ui = inject(UiState);
  ui.startRequest();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      ui.notify(errorMessage(error), 'error');
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
