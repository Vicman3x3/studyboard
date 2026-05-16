import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import {
  BloqueHorario,
  BloquesListResponse,
  DiaSemana,
  DIAS_SEMANA,
  HORAS_DIA,
} from '../horario.model';
import { MateriasListResponse } from '../../materias/materias.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BloqueFormComponent } from '../bloque-form/bloque-form.component';

@Component({
  selector: 'app-horario-grid',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FormsModule,
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    BloqueFormComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './horario-grid.component.html',
  styleUrl: './horario-grid.component.scss',
})
export class HorarioGridComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  readonly bloques = signal<BloqueHorario[]>([]);
  readonly materias = signal<any[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedMateriaId = signal<string | null>(null);
  readonly showBloqueForm = signal(false);
  readonly selectedBloque = signal<BloqueHorario | null>(null);

  readonly diasSemana = DIAS_SEMANA;
  readonly horasDia = HORAS_DIA;

  readonly filteredBloques = computed(() => {
    const materiaId = this.selectedMateriaId();
    if (!materiaId) return this.bloques();
    return this.bloques().filter((b) => b.materiaId === materiaId);
  });

  ngOnInit() {
    this.loadMaterias();
    this.loadBloques();
  }

  loadMaterias() {
    this.httpService.get<MateriasListResponse>(API_ENDPOINTS.materias.getAll).subscribe({
      next: (response) => this.materias.set(response.data),
      error: () => this.errorMessage.set('Error al cargar las materias'),
    });
  }

  loadBloques() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const endpoint = this.selectedMateriaId()
      ? `${API_ENDPOINTS.horario.getAll}?materia_id=${this.selectedMateriaId()}`
      : API_ENDPOINTS.horario.getAll;

    this.httpService.get<BloquesListResponse>(endpoint).subscribe({
      next: (response) => {
        this.bloques.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al cargar el horario');
        this.isLoading.set(false);
      },
    });
  }

  onMateriaFilterChange() {
    this.loadBloques();
  }

  openCreateDialog() {
    this.selectedBloque.set(null);
    this.showBloqueForm.set(true);
  }

  openEditDialog(bloque: BloqueHorario) {
    this.selectedBloque.set(bloque);
    this.showBloqueForm.set(true);
  }

  onBloqueFormClose() {
    this.showBloqueForm.set(false);
    this.selectedBloque.set(null);
  }

  onBloqueSaved() {
    this.loadBloques();
    this.showBloqueForm.set(false);
    this.selectedBloque.set(null);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Bloque de horario guardado correctamente',
    });
  }

  deleteBloque(bloque: BloqueHorario) {
    this.confirmationService.confirm({
      message: `¿Eliminar el bloque de ${bloque.materia.nombre} el ${this.getDiaLabel(bloque.dia)}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.httpService.delete(API_ENDPOINTS.horario.delete(bloque.id)).subscribe({
          next: () => {
            this.loadBloques();
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Bloque eliminado exitosamente',
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Error al eliminar el bloque',
            });
          },
        });
      },
    });
  }

  getBloqueForCell(dia: DiaSemana, hora: string): BloqueHorario | null {
    return (
      this.filteredBloques().find((b) => b.dia === dia && this.isInTimeRange(hora, b.horaInicio, b.horaFin)) || null
    );
  }

  private isInTimeRange(hora: string, inicio: string, fin: string): boolean {
    return hora >= inicio && hora < fin;
  }

  getDiaLabel(dia: DiaSemana): string {
    return this.diasSemana.find((d) => d.value === dia)?.label || dia;
  }

  getBloqueDuration(bloque: BloqueHorario): number {
    const inicio = this.horasDia.indexOf(bloque.horaInicio);
    const fin = this.horasDia.findIndex((h) => h >= bloque.horaFin);
    return fin > inicio ? fin - inicio : 1;
  }
}
