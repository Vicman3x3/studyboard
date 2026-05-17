import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import {
  CriterioEvaluacion,
  Calificacion,
  CriteriosListResponse,
  CalificacionesListResponse,
  PromedioResponse,
  ProyeccionResponse,
  CriterioResponse,
  CalificacionResponse,
} from '../calificaciones.model';
import { MateriasListResponse } from '../../materias/materias.model';
import { ParcialesListResponse } from '../../temarios/temarios.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-calificaciones-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressBarModule,
    TagModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './calificaciones-list.component.html',
  styleUrl: './calificaciones-list.component.scss',
})
export class CalificacionesListComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  readonly materias = signal<any[]>([]);
  readonly selectedMateriaId = signal<string | null>(null);
  readonly criterios = signal<CriterioEvaluacion[]>([]);
  readonly parciales = signal<any[]>([]);
  readonly calificaciones = signal<Calificacion[]>([]);
  readonly promedio = signal<number>(0);
  readonly proyeccion = signal<{ notaNecesaria: number; esPosible: boolean } | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly showCriterioDialog = signal(false);
  readonly showCalificacionDialog = signal(false);
  readonly editingCriterio = signal<CriterioEvaluacion | null>(null);
  readonly editingCalificacion = signal<Calificacion | null>(null);

  readonly criterioForm = signal({ nombre: '', ponderacion: 0, materiaId: '' });
  readonly calificacionForm = signal({ valor: 0, criterioId: '', parcialId: '' });

  readonly totalPonderacion = computed(() =>
    this.criterios().reduce((sum, c) => sum + c.ponderacion, 0)
  );

  ngOnInit() {
    this.loadMaterias();
  }

  loadMaterias() {
    this.httpService.get<MateriasListResponse>(API_ENDPOINTS.materias.getAll).subscribe({
      next: (response) => {
        this.materias.set(response.data);
        if (response.data.length > 0) {
          this.selectedMateriaId.set(response.data[0].id);
          this.onMateriaChange();
        }
      },
      error: () => this.errorMessage.set('Error al cargar las materias'),
    });
  }

  onMateriaChange() {
    if (!this.selectedMateriaId()) return;
    this.loadCriterios();
    this.loadParciales();
    this.loadCalificaciones();
    this.loadPromedio();
    this.loadProyeccion();
  }

  loadCriterios() {
    const endpoint = `${API_ENDPOINTS.calificaciones.criterios.getAll}?materia_id=${this.selectedMateriaId()}`;
    this.httpService.get<CriteriosListResponse>(endpoint).subscribe({
      next: (response) => this.criterios.set(response.data),
      error: () => {},
    });
  }

  loadParciales() {
    const endpoint = `${API_ENDPOINTS.temarios.parciales.getAll}?materia_id=${this.selectedMateriaId()}`;
    this.httpService.get<ParcialesListResponse>(endpoint).subscribe({
      next: (response) => this.parciales.set(response.data),
      error: () => {},
    });
  }

  loadCalificaciones() {
    const endpoint = `${API_ENDPOINTS.calificaciones.getAll}?materia_id=${this.selectedMateriaId()}`;
    this.httpService.get<CalificacionesListResponse>(endpoint).subscribe({
      next: (response) => this.calificaciones.set(response.data),
      error: () => {},
    });
  }

  loadPromedio() {
    this.httpService
      .get<PromedioResponse>(API_ENDPOINTS.calificaciones.promedio(this.selectedMateriaId()!))
      .subscribe({
        next: (response) => this.promedio.set(response.data.promedio),
        error: () => {},
      });
  }

  loadProyeccion() {
    this.httpService
      .get<ProyeccionResponse>(API_ENDPOINTS.calificaciones.proyeccion(this.selectedMateriaId()!))
      .subscribe({
        next: (response) => this.proyeccion.set(response.data),
        error: () => {},
      });
  }

  // === CRITERIOS ===

  openCriterioDialog(criterio?: CriterioEvaluacion) {
    if (criterio) {
      this.editingCriterio.set(criterio);
      this.criterioForm.set({
        nombre: criterio.nombre,
        ponderacion: criterio.ponderacion,
        materiaId: criterio.materiaId,
      });
    } else {
      this.editingCriterio.set(null);
      this.criterioForm.set({ nombre: '', ponderacion: 0, materiaId: this.selectedMateriaId()! });
    }
    this.showCriterioDialog.set(true);
  }

  saveCriterio() {
    const data = this.criterioForm();
    if (!data.nombre || data.ponderacion <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Complete todos los campos' });
      return;
    }

    this.isLoading.set(true);
    const request = this.editingCriterio()
      ? this.httpService.patch<CriterioResponse>(
          API_ENDPOINTS.calificaciones.criterios.update(this.editingCriterio()!.id),
          data
        )
      : this.httpService.post<CriterioResponse>(API_ENDPOINTS.calificaciones.criterios.create, data);

    request.subscribe({
      next: () => {
        this.loadCriterios();
        this.showCriterioDialog.set(false);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Criterio guardado' });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al guardar' });
        this.isLoading.set(false);
      },
    });
  }

  deleteCriterio(criterio: CriterioEvaluacion) {
    this.confirmationService.confirm({
      message: `¿Eliminar el criterio "${criterio.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.httpService.delete(API_ENDPOINTS.calificaciones.criterios.delete(criterio.id)).subscribe({
          next: () => {
            this.loadCriterios();
            this.loadCalificaciones();
            this.loadPromedio();
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Criterio eliminado' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message });
          },
        });
      },
    });
  }

  // === CALIFICACIONES ===

  openCalificacionDialog(calificacion?: Calificacion) {
    if (calificacion) {
      this.editingCalificacion.set(calificacion);
      this.calificacionForm.set({
        valor: calificacion.valor,
        criterioId: calificacion.criterioId,
        parcialId: calificacion.parcialId,
      });
    } else {
      this.editingCalificacion.set(null);
      this.calificacionForm.set({ valor: 0, criterioId: '', parcialId: '' });
    }
    this.showCalificacionDialog.set(true);
  }

  saveCalificacion() {
    const data = this.calificacionForm();
    if (!data.criterioId || !data.parcialId || data.valor < 0) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Complete todos los campos' });
      return;
    }

    this.isLoading.set(true);
    const request = this.editingCalificacion()
      ? this.httpService.patch<CalificacionResponse>(
          API_ENDPOINTS.calificaciones.update(this.editingCalificacion()!.id),
          data
        )
      : this.httpService.post<CalificacionResponse>(API_ENDPOINTS.calificaciones.create, data);

    request.subscribe({
      next: () => {
        this.loadCalificaciones();
        this.loadPromedio();
        this.loadProyeccion();
        this.showCalificacionDialog.set(false);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Calificación guardada' });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al guardar' });
        this.isLoading.set(false);
      },
    });
  }

  deleteCalificacion(calificacion: Calificacion) {
    this.confirmationService.confirm({
      message: '¿Eliminar esta calificación?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.httpService.delete(API_ENDPOINTS.calificaciones.delete(calificacion.id)).subscribe({
          next: () => {
            this.loadCalificaciones();
            this.loadPromedio();
            this.loadProyeccion();
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Calificación eliminada' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message });
          },
        });
      },
    });
  }

  getCalificacionesPorCriterio(criterioId: string): Calificacion[] {
    return this.calificaciones().filter((c) => c.criterioId === criterioId);
  }

  getPromedioCriterio(criterioId: string): number {
    const califs = this.getCalificacionesPorCriterio(criterioId);
    if (califs.length === 0) return 0;
    return califs.reduce((sum, c) => sum + c.valor, 0) / califs.length;
  }

  getSeverityByNota(nota: number): 'success' | 'warning' | 'danger' {
    if (nota >= 70) return 'success';
    if (nota >= 60) return 'warning';
    return 'danger';
  }
}
