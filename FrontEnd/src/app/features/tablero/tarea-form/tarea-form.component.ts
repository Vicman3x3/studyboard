import {
  Component,
  inject,
  signal,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import {
  Tarea,
  CreateTareaRequest,
  UpdateTareaRequest,
  PrioridadTarea,
  TareaResponse,
} from '../../../core/models/tarea.model';
import { Materia } from '../../../core/models/materia.model';

@Component({
  selector: 'app-tarea-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    MessageModule,
  ],
  templateUrl: './tarea-form.component.html',
  styleUrl: './tarea-form.component.scss',
})
export class TareaFormComponent {
  private readonly httpService = inject(HttpService);

  @Input() visible = false;
  @Input() tarea: Tarea | null = null;
  @Input() materias: Materia[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSuccess = new EventEmitter<void>();

  readonly formData = signal<CreateTareaRequest | UpdateTareaRequest>({
    titulo: '',
    descripcion: '',
    prioridad: PrioridadTarea.MEDIA,
    materiaId: '',
  });
  readonly errorMessage = signal<string>('');
  readonly isLoading = signal<boolean>(false);

  readonly prioridadOptions = [
    { label: 'Baja', value: PrioridadTarea.BAJA },
    { label: 'Media', value: PrioridadTarea.MEDIA },
    { label: 'Alta', value: PrioridadTarea.ALTA },
  ];

  ngOnChanges() {
    if (this.tarea) {
      this.formData.set({
        titulo: this.tarea.titulo,
        descripcion: this.tarea.descripcion || '',
        prioridad: this.tarea.prioridad,
        fechaEntrega: this.tarea.fechaEntrega,
        materiaId: this.tarea.materiaId,
      });
    } else {
      this.resetForm();
    }
  }

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const request = this.tarea
      ? this.httpService.patch<TareaResponse>(
          API_ENDPOINTS.tareas.update(this.tarea.id),
          this.formData()
        )
      : this.httpService.post<TareaResponse>(
          API_ENDPOINTS.tareas.create,
          this.formData()
        );

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.closeDialog();
        this.onSuccess.emit();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message || 'Error al guardar tarea'
        );
        this.isLoading.set(false);
      },
    });
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  private resetForm() {
    this.formData.set({
      titulo: '',
      descripcion: '',
      prioridad: PrioridadTarea.MEDIA,
      materiaId: '',
    });
    this.errorMessage.set('');
  }

  updateFormData<K extends keyof (CreateTareaRequest | UpdateTareaRequest)>(
    field: K,
    value: (CreateTareaRequest | UpdateTareaRequest)[K]
  ) {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }
}
