import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UiState } from './ui-state';

export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const ui = inject(UiState); // injecté avant le premier await (contexte d'injection)
  if (await auth.verify()) return true;

  if (auth.isLoggedIn()) {
    // Session présente mais refusée par le serveur (expirée ou révoquée).
    auth.forget();
    ui.notify('Votre session a expiré. Reconnectez-vous.', 'error');
  }
  return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};
