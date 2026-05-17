import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import { Parcial, ParcialesListResponse } from '../temarios.model';
import { MateriasListResponse } from '../../materias/materias.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { ParcialFormComponent } from '../parcial-form/parcial-form.component';
import { ItemTemarioListComponent } from '../item-temario-list/item-temario-list.component';

@Component({
  selector: 'app-temario-list',
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
    PanelModule,
    TagModule,
    ParcialFormComponent,
    ItemTemarioListComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './temario-list.component.html',
  styleUrl: './temario-list.component.scss',
})
export class TemarioListComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  readonly parciales = signal<Parcial[]>([]);
  readonly materias = signal<any[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedMateriaId = signal<string | null>(null);
  readonly showParcialForm = signal(false);
  readonly selectedParcial = signal<Parcial | null>(null);
  readonly selectedParcialForItems = signal<Parcial | null>(null);

  ngOnInit() {
    this.loadMaterias();
  }

  loadMaterias() {
    this.httpService.get<MateriasListResponse>(API_ENDPOINTS.materias.getAll).subscribe({
      next: (response) => {
        this.materias.set(response.data);
        if (response.data.length > 0) {
          this.selectedMateriaId.set(response.data[0].id);
          this.loadParciales();
        }
      },
      error: () => this.errorMessage.set('Error al cargar las materias'),
    });
  }

  loadParciales() {
    if (!this.selectedMateriaId()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const endpoint = `${API_ENDPOINTS.temarios.parciales.getAll}?materia_id=${this.selectedMateriaId()}`;

    this.httpService.get<ParcialesListResponse>(endpoint).subscribe({
      next: (response) => {
        this.parciales.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al cargar los parciales');
        this.isLoading.set(false);
      },
    });
  }

  onMateriaChange() {
    this.loadParciales();
    this.selectedParcialForItems.set(null);
  }

  openCreateDialog() {
    this.selectedParcial.set(null);
    this.showParcialForm.set(true);
  }

  openEditDialog(parcial: Parcial) {
    this.selectedParcial.set(parcial);
    this.showParcialForm.set(true);
  }

  onParcialFormClose() {
    this.showParcialForm.set(false);
    this.selectedParcial.set(null);
  }

  onParcialSaved() {
    this.loadParciales();
    this.showParcialForm.set(false);
    this.selectedParcial.set(null);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Parcial guardado correctamente',
    });
  }

  deleteParcial(parcial: Parcial) {
    this.confirmationService.confirm({
      message: `¿Eliminar el parcial "${parcial.nombre}"? Esto eliminará también todos sus temas.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.httpService.delete(API_ENDPOINTS.temarios.parciales.delete(parcial.id)).subscribe({
          next: () => {
            this.loadParciales();
            if (this.selectedParcialForItems()?.id === parcial.id) {
              this.selectedParcialForItems.set(null);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Parcial eliminado exitosamente',
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Error al eliminar el parcial',
            });
          },
        });
      },
    });
  }

  selectParcial(parcial: Parcial) {
    this.selectedParcialForItems.set(parcial);
  }

  isParcialPassed(fechaExamen: Date): boolean {
    return new Date(fechaExamen) < new Date();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
