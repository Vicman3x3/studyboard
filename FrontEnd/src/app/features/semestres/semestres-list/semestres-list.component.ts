import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import {
  Semestre,
  SemestresListResponse,
  SemestreResponse,
} from '../../../core/models/semestre.model';
import { SemestreFormComponent } from '../semestre-form/semestre-form.component';

@Component({
  selector: 'app-semestres-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    SkeletonModule,
    MessageModule,
    ConfirmDialogModule,
    SemestreFormComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './semestres-list.component.html',
  styleUrl: './semestres-list.component.scss',
})
export class SemestresListComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  readonly semestres = signal<Semestre[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly showFormDialog = signal<boolean>(false);
  readonly selectedSemestre = signal<Semestre | null>(null);

  ngOnInit() {
    this.loadSemestres();
  }

  loadSemestres() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.httpService
      .get<SemestresListResponse>(API_ENDPOINTS.semestres.getAll)
      .subscribe({
        next: (response) => {
          this.semestres.set(response.data);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(
            error.error?.message || 'Error al cargar semestres'
          );
          this.isLoading.set(false);
        },
      });
  }

  openCreateDialog() {
    this.selectedSemestre.set(null);
    this.showFormDialog.set(true);
  }

  editSemestre(semestre: Semestre) {
    this.selectedSemestre.set(semestre);
    this.showFormDialog.set(true);
  }

  activarSemestre(semestre: Semestre) {
    if (semestre.activo) return;

    this.httpService
      .patch<SemestreResponse>(API_ENDPOINTS.semestres.activar(semestre.id), {})
      .subscribe({
        next: () => {
          this.loadSemestres();
        },
        error: (error) => {
          this.errorMessage.set(
            error.error?.message || 'Error al activar semestre'
          );
        },
      });
  }

  verMaterias(semestre: Semestre) {
    this.router.navigate(['/materias'], {
      queryParams: { semestre: semestre.id },
    });
  }

  deleteSemestre(semestre: Semestre) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el semestre "${semestre.nombre}"? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.httpService
          .delete<SemestreResponse>(API_ENDPOINTS.semestres.delete(semestre.id))
          .subscribe({
            next: () => {
              this.loadSemestres();
            },
            error: (error) => {
              this.errorMessage.set(
                error.error?.message || 'Error al eliminar semestre'
              );
            },
          });
      },
    });
  }

  onFormSuccess() {
    this.loadSemestres();
  }
}
