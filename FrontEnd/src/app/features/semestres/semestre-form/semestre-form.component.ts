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
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import {
  Semestre,
  CreateSemestreRequest,
  UpdateSemestreRequest,
  SemestreResponse,
} from '../../../core/models/semestre.model';

@Component({
  selector: 'app-semestre-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DialogModule,
    MessageModule,
  ],
  templateUrl: './semestre-form.component.html',
  styleUrl: './semestre-form.component.scss',
})
export class SemestreFormComponent {
  private readonly httpService = inject(HttpService);

  @Input() visible = false;
  @Input() semestre: Semestre | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSuccess = new EventEmitter<void>();

  readonly formData = signal<CreateSemestreRequest | UpdateSemestreRequest>({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
  });
  readonly errorMessage = signal<string>('');
  readonly isLoading = signal<boolean>(false);

  ngOnChanges() {
    if (this.semestre) {
      this.formData.set({
        nombre: this.semestre.nombre,
        fechaInicio: this.semestre.fechaInicio,
        fechaFin: this.semestre.fechaFin,
      });
    } else {
      this.resetForm();
    }
  }

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const request = this.semestre
      ? this.httpService.patch<SemestreResponse>(
          API_ENDPOINTS.semestres.update(this.semestre.id),
          this.formData()
        )
      : this.httpService.post<SemestreResponse>(
          API_ENDPOINTS.semestres.create,
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
          error.error?.message || 'Error al guardar semestre'
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
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
    });
    this.errorMessage.set('');
  }

  updateFormData<K extends keyof (CreateSemestreRequest | UpdateSemestreRequest)>(
    field: K,
    value: (CreateSemestreRequest | UpdateSemestreRequest)[K]
  ) {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }
}
