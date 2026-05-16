import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import {
  Tarea,
  EstadoTarea,
  TareasListResponse,
  UpdateEstadoRequest,
  TareaResponse,
} from '../../../core/models/tarea.model';
import { Materia, MateriasListResponse } from '../../../core/models/materia.model';
import { TareaCardComponent } from '../tarea-card/tarea-card.component';
import { TareaFormComponent } from '../tarea-form/tarea-form.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    MessageModule,
    SkeletonModule,
    FormsModule,
    TareaCardComponent,
    TareaFormComponent,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss',
})
export class KanbanBoardComponent implements OnInit {
  private readonly httpService = inject(HttpService);

  readonly tareas = signal<Tarea[]>([]);
  readonly materias = signal<Materia[]>([]);
  readonly selectedMateria = signal<Materia | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly showFormDialog = signal<boolean>(false);
  readonly editingTarea = signal<Tarea | null>(null);

  readonly EstadoTarea = EstadoTarea;

  readonly tareasPendientes = computed(() =>
    this.filteredTareas().filter((t) => t.estado === EstadoTarea.PENDIENTE)
  );
  readonly tareasEnProgreso = computed(() =>
    this.filteredTareas().filter((t) => t.estado === EstadoTarea.EN_PROGRESO)
  );
  readonly tareasCompletadas = computed(() =>
    this.filteredTareas().filter((t) => t.estado === EstadoTarea.COMPLETADA)
  );

  private filteredTareas = computed(() => {
    const materiaId = this.selectedMateria()?.id;
    if (!materiaId) return this.tareas();
    return this.tareas().filter((t) => t.materiaId === materiaId);
  });

  ngOnInit() {
    this.loadMaterias();
    this.loadTareas();
  }

  loadMaterias() {
    this.httpService
      .get<MateriasListResponse>(API_ENDPOINTS.materias.getAll)
      .subscribe({
        next: (response) => {
          this.materias.set(response.data);
        },
        error: (error) => {
          console.error('Error al cargar materias:', error);
        },
      });
  }

  loadTareas() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const materiaId = this.selectedMateria()?.id;
    const endpoint = materiaId
      ? `${API_ENDPOINTS.tareas.getAll}?materia_id=${materiaId}`
      : API_ENDPOINTS.tareas.getAll;

    this.httpService.get<TareasListResponse>(endpoint).subscribe({
      next: (response) => {
        this.tareas.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message || 'Error al cargar tareas'
        );
        this.isLoading.set(false);
      },
    });
  }

  onMateriaFilterChange() {
    this.loadTareas();
  }

  onTareaDropped(tarea: Tarea, newEstado: EstadoTarea) {
    if (tarea.estado === newEstado) return;

    const updateRequest: UpdateEstadoRequest = { estado: newEstado };

    this.httpService
      .patch<TareaResponse>(
        API_ENDPOINTS.tareas.updateStatus(tarea.id),
        updateRequest
      )
      .subscribe({
        next: () => {
          this.loadTareas();
        },
        error: (error) => {
          this.errorMessage.set(
            error.error?.message || 'Error al actualizar estado'
          );
        },
      });
  }

  openCreateDialog() {
    this.editingTarea.set(null);
    this.showFormDialog.set(true);
  }

  editTarea(tarea: Tarea) {
    this.editingTarea.set(tarea);
    this.showFormDialog.set(true);
  }

  onFormSuccess() {
    this.loadTareas();
  }
}
