import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

const authPage = () => import('./pages/auth/auth-page').then((m) => m.AuthPage);

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home), title: 'IdableForm' },
  { path: 'login', loadComponent: authPage, data: { mode: 'login' }, title: 'Connexion · IdableForm' },
  { path: 'signup', loadComponent: authPage, data: { mode: 'signup' }, title: 'Créer un compte · IdableForm' },
  { path: 'forms', canActivate: [authGuard], loadComponent: () => import('./pages/admin/form-list').then((m) => m.FormList), title: 'Mes formulaires · IdableForm' },
  { path: 'forms/:id/results', canActivate: [authGuard], loadComponent: () => import('./pages/admin/form-results').then((m) => m.FormResults), title: 'Résultats · IdableForm' },
  { path: 'form/edit/:id', canActivate: [authGuard], loadComponent: () => import('./pages/admin/form-editor').then((m) => m.FormEditor), title: 'Modifier le formulaire · IdableForm' },
  { path: 'form/:id', loadComponent: () => import('./pages/form-runner/form-runner').then((m) => m.FormRunner) },
  { path: 'createNewForm', canActivate: [authGuard], loadComponent: () => import('./pages/admin/form-editor').then((m) => m.FormEditor), title: 'Nouveau formulaire · IdableForm' },
  { path: 'thankyou', loadComponent: () => import('./pages/thank-you/thank-you').then((m) => m.ThankYou), title: 'Merci ! · IdableForm' },
  // Anciennes adresses de l'administration
  { path: 'admin/login', redirectTo: 'login' },
  { path: 'admin/forms/:id/results', redirectTo: 'forms/:id/results' },
  { path: 'admin/forms', redirectTo: 'forms' },
  { path: 'csv/:id', redirectTo: 'forms' },
  { path: '**', redirectTo: '' },
];
