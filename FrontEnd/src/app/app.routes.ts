import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'semestres',
        loadChildren: () =>
          import('./features/semestres/semestres.routes').then((m) => m.semestresRoutes),
      },
      {
        path: 'materias',
        loadChildren: () =>
          import('./features/materias/materias.routes').then((m) => m.materiasRoutes),
      },
      {
        path: 'tablero',
        loadChildren: () =>
          import('./features/tablero/tablero.routes').then((m) => m.tableroRoutes),
      },
      {
        path: 'horario',
        loadChildren: () =>
          import('./features/horario/horario.routes').then((m) => m.horarioRoutes),
      },
      {
        path: 'temarios',
        loadChildren: () =>
          import('./features/temarios/temarios.routes').then((m) => m.temariosRoutes),
      },
      {
        path: 'calificaciones',
        loadChildren: () =>
          import('./features/calificaciones/calificaciones.routes').then((m) => m.calificacionesRoutes),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
