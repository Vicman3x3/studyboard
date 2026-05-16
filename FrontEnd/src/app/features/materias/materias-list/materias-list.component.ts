import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MateriasService } from '../../../core/services/materias.service';
import { Materia } from '../../../core/models/materia.model';
import { MateriaFormComponent } from '../materia-form/materia-form.component';

@Component({
  selector: 'app-materias-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChipModule,
    SkeletonModule,
    MessageModule,
    ConfirmDialogModule,
    MateriaFormComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './materias-list.component.html',
  styleUrl: './materias-list.component.scss',
})
export class MateriasListComponent implements OnInit {
  private readonly materiasService = inject(MateriasService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly materias = signal<Materia[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly showFormDialog = signal<boolean>(false);
  readonly selectedMateria = signal<Materia | null>(null);

  ngOnInit() {
    this.loadMaterias();
  }

  loadMaterias() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.materiasService.getAll().subscribe({
      next: (response) => {
        this.materias.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message || 'Error al cargar materias'
        );
        this.isLoading.set(false);
      },
    });
  }

  openCreateDialog() {
    this.selectedMateria.set(null);
    this.showFormDialog.set(true);
  }

  editMateria(materia: Materia) {
    this.selectedMateria.set(materia);
    this.showFormDialog.set(true);
  }

  deleteMateria(materia: Materia) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la materia "${materia.nombre}"? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.materiasService.delete(materia.id).subscribe({
          next: () => {
            this.loadMaterias();
          },
          error: (error) => {
            this.errorMessage.set(
              error.error?.message || 'Error al eliminar materia'
            );
          },
        });
      },
    });
  }

  onFormSuccess() {
    this.loadMaterias();
  }
}
