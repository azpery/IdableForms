import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UiState } from './ui-state';

export const adminGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const ui = inject(UiState); // injecté avant le premier await (contexte d'injection)
  if (await auth.verify()) return true;

  if (auth.isLoggedIn()) {
    // Jeton présent mais refusé par le serveur (mot de passe changé, jeton invalide).
    auth.logout();
    ui.notify('Votre session a expiré. Reconnectez-vous.', 'error');
  }
  return router.createUrlTree(['/admin/login'], { queryParams: { redirect: state.url } });
};
