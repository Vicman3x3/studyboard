import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'semestres',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/semestres/semestres.routes').then((m) => m.semestresRoutes),
  },
  {
    path: 'materias',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/materias/materias.routes').then((m) => m.materiasRoutes),
  },
  {
    path: 'tablero',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/tablero/tablero.routes').then((m) => m.tableroRoutes),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
