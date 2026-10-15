import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home), title: 'IdableForms' },
  { path: 'form/edit/:id', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/form-editor').then((m) => m.FormEditor), title: 'Modifier le formulaire · IdableForms' },
  { path: 'form/:id', loadComponent: () => import('./pages/form-runner/form-runner').then((m) => m.FormRunner) },
  { path: 'createNewForm', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/form-editor').then((m) => m.FormEditor), title: 'Nouveau formulaire · IdableForms' },
  { path: 'admin/login', loadComponent: () => import('./pages/admin/admin-login').then((m) => m.AdminLogin), title: 'Connexion · IdableForms' },
  { path: 'admin/forms/:id/results', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/form-results').then((m) => m.FormResults), title: 'Résultats · IdableForms' },
  { path: 'admin/forms', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/form-list').then((m) => m.FormList), title: 'Administration · IdableForms' },
  { path: 'thankyou', loadComponent: () => import('./pages/thank-you/thank-you').then((m) => m.ThankYou), title: 'Merci ! · IdableForms' },
  { path: 'csv/:id', redirectTo: 'admin/forms' },
  { path: '**', redirectTo: '' },
];
