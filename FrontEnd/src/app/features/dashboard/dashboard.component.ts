import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpService } from '../../core/services/http.service';
import { API_ENDPOINTS } from '../../core/config/api.endpoints';
import { AuthService } from '../../core/services/auth.service';
import {
  DashboardResumen,
  ResumenResponse,
  ProximasEntregasResponse,
  AccesoRapido,
} from './dashboard.model';
import { Tarea } from '../tablero/tablero.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ProgressBarModule, TagModule, MessageModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  readonly resumen = signal<DashboardResumen | null>(null);
  readonly proximasEntregas = signal<Tarea[]>([]);
  readonly isLoading = signal(false);

  readonly accesosRapidos: AccesoRapido[] = [
    {
      titulo: 'Mis Materias',
      descripcion: 'Gestiona tus materias y semestres',
      icono: 'pi pi-book',
      ruta: '/materias',
      color: '#003F8A',
    },
    {
      titulo: 'Tablero Kanban',
      descripcion: 'Organiza tus tareas pendientes',
      icono: 'pi pi-th-large',
      ruta: '/tablero',
      color: '#00843D',
    },
    {
      titulo: 'Horario',
      descripcion: 'Consulta tu horario semanal',
      icono: 'pi pi-calendar',
      ruta: '/horario',
      color: '#f59e0b',
    },
    {
      titulo: 'Temarios',
      descripcion: 'Revisa los temarios por parcial',
      icono: 'pi pi-list',
      ruta: '/temarios',
      color: '#8b5cf6',
    },
    {
      titulo: 'Calificaciones',
      descripcion: 'Consulta tu promedio y proyección',
      icono: 'pi pi-chart-line',
      ruta: '/calificaciones',
      color: '#ec4899',
    },
    {
      titulo: 'Semestres',
      descripcion: 'Administra tus semestres',
      icono: 'pi pi-folder',
      ruta: '/semestres',
      color: '#6366f1',
    },
  ];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    this.loadResumen();
    this.loadProximasEntregas();
  }

  loadResumen() {
    this.httpService.get<ResumenResponse>(API_ENDPOINTS.dashboard.resumen).subscribe({
      next: (response) => {
        this.resumen.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  loadProximasEntregas() {
    this.httpService.get<ProximasEntregasResponse>(API_ENDPOINTS.dashboard.proximasEntregas).subscribe({
      next: (response) => {
        this.proximasEntregas.set(response.data);
      },
      error: () => {},
    });
  }

  navigateTo(ruta: string) {
    this.router.navigate([ruta]);
  }

  isPrioridad(prioridad: string): boolean {
    return prioridad === 'alta';
  }

  isOverdue(fechaEntrega: Date): boolean {
    return new Date(fechaEntrega) < new Date();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  }

  logout() {
    this.authService.logout();
  }
}
