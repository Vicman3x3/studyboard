import {
  Component,
  signal,
  inject,
  OnInit,
  OnDestroy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpService } from '../../core/services/http.service';
import { API_ENDPOINTS } from '../../core/config/api.endpoints';
import {
  Alerta,
  AlertasResponse,
  ContarNoLeidasResponse,
} from '../alertas/alertas.model';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    BadgeModule,
    ButtonModule,
    OverlayPanelModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="layout-wrapper">
      <p-menubar [model]="menuItems()">
        <ng-template pTemplate="end">
          <div class="flex align-items-center gap-2">
            <button
              pButton
              icon="pi pi-bell"
              class="p-button-text"
              [badge]="conteoAlertas() > 0 ? conteoAlertas().toString() : ''"
              badgeClass="p-badge-danger"
              (click)="toggleAlertas($event, opAlertas)"
              [disabled]="cargandoAlertas()"
            ></button>
            <button
              pButton
              icon="pi pi-sign-out"
              label="Salir"
              class="p-button-text"
              (click)="cerrarSesion()"
            ></button>
          </div>
        </ng-template>
      </p-menubar>

      <p-overlayPanel #opAlertas>
        <div class="alertas-panel">
          <h3>Alertas pendientes</h3>
          @if (cargandoAlertas()) {
            <div class="text-center">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
          } @else if (alertas().length === 0) {
            <p class="text-muted">No hay alertas pendientes</p>
          } @else {
            <div class="alertas-list">
              @for (alerta of alertas(); track alerta.id) {
                <div
                  class="alerta-item"
                  [class.no-leida]="!alerta.leida"
                  (click)="marcarLeida(alerta.id)"
                >
                  <div class="alerta-header">
                    <strong>{{ alerta.tarea.titulo }}</strong>
                    @if (!alerta.leida) {
                      <span class="badge-nuevo">Nueva</span>
                    }
                  </div>
                  <div class="alerta-materia">
                    {{ alerta.tarea.materia.nombre }}
                  </div>
                  <div class="alerta-fecha">
                    <i class="pi pi-calendar"></i>
                    {{ alerta.tarea.fechaEntrega | date: 'dd/MM/yyyy' }}
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </p-overlayPanel>

      <div class="layout-content">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [
    `
      .layout-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .layout-content {
        flex: 1;
        padding: 1.5rem;
        background-color: #f8f9fa;
      }

      .alertas-panel {
        width: 350px;
        max-width: 90vw;

        h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          color: #003f8a;
        }
      }

      .alertas-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-height: 400px;
        overflow-y: auto;
      }

      .alerta-item {
        padding: 0.75rem;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background-color: #f5f5f5;
          border-color: #003f8a;
        }

        &.no-leida {
          background-color: #e3f2fd;
          border-color: #003f8a;
        }
      }

      .alerta-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        strong {
          color: #333;
        }
      }

      .badge-nuevo {
        background-color: #f44336;
        color: white;
        padding: 0.125rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .alerta-materia {
        color: #666;
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
      }

      .alerta-fecha {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: #999;
        font-size: 0.875rem;

        i {
          font-size: 0.75rem;
        }
      }

      .text-muted {
        color: #999;
        text-align: center;
        padding: 1rem;
      }

      .text-center {
        text-align: center;
        padding: 2rem;
      }
    `,
  ],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  protected readonly menuItems = signal([
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/dashboard'],
    },
    {
      label: 'Semestres',
      icon: 'pi pi-calendar',
      routerLink: ['/semestres'],
    },
    {
      label: 'Materias',
      icon: 'pi pi-book',
      routerLink: ['/materias'],
    },
    {
      label: 'Tablero',
      icon: 'pi pi-th-large',
      routerLink: ['/tablero'],
    },
    {
      label: 'Horario',
      icon: 'pi pi-clock',
      routerLink: ['/horario'],
    },
    {
      label: 'Temarios',
      icon: 'pi pi-list',
      routerLink: ['/temarios'],
    },
    {
      label: 'Calificaciones',
      icon: 'pi pi-star',
      routerLink: ['/calificaciones'],
    },
  ]);

  protected readonly alertas = signal<Alerta[]>([]);
  protected readonly conteoAlertas = computed(
    () => this.alertas().filter((a) => !a.leida).length
  );
  protected readonly cargandoAlertas = signal(false);

  private pollingInterval?: number;
  private alertasMostradas = false;

  ngOnInit() {
    this.cargarAlertas();
    this.iniciarPolling();
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  private iniciarPolling() {
    // Polling cada 5 minutos
    this.pollingInterval = window.setInterval(
      () => {
        this.cargarAlertas();
      },
      5 * 60 * 1000
    );
  }

  protected async cargarAlertas() {
    this.cargandoAlertas.set(true);
    try {
      const response = await this.http.get<AlertasResponse>(
        API_ENDPOINTS.alertas.getAll
      );
      const alertasAnteriores = this.alertas().length;
      this.alertas.set(response.data);

      // Mostrar toast solo si hay nuevas alertas y no es la primera carga
      if (
        !this.alertasMostradas &&
        alertasAnteriores === 0 &&
        response.data.length > 0
      ) {
        const noLeidas = response.data.filter((a) => !a.leida).length;
        if (noLeidas > 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Alertas pendientes',
            detail: `Tienes ${noLeidas} ${noLeidas === 1 ? 'tarea próxima' : 'tareas próximas'} por entregar`,
            life: 5000,
          });
        }
        this.alertasMostradas = true;
      }
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    } finally {
      this.cargandoAlertas.set(false);
    }
  }

  protected toggleAlertas(event: Event, op: any) {
    this.cargarAlertas();
    op.toggle(event);
  }

  protected async marcarLeida(alertaId: string) {
    try {
      await this.http.post(API_ENDPOINTS.alertas.marcarLeida(alertaId), {});
      // Actualizar el estado local
      this.alertas.update((alertas) =>
        alertas.map((a) => (a.id === alertaId ? { ...a, leida: true } : a))
      );
    } catch (error) {
      console.error('Error al marcar alerta como leída:', error);
    }
  }

  protected cerrarSesion() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/auth/login']);
  }
}
