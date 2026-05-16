import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import { Materia, CreateMateriaRequest, UpdateMateriaRequest, MateriaResponse } from '../../../core/models/materia.model';

@Component({
  selector: 'app-materia-form',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ColorPickerModule,
    DialogModule,
    MessageModule,
  ],
  templateUrl: './materia-form.component.html',
  styleUrl: './materia-form.component.scss',
})
export class MateriaFormComponent {
  private readonly httpService = inject(HttpService);

  @Input() visible = false;
  @Input() materia: Materia | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSuccess = new EventEmitter<void>();

  readonly formData = signal<CreateMateriaRequest | UpdateMateriaRequest>({
    nombre: '',
    color: '#003F8A',
    creditos: 4,
    docente: '',
  });
  readonly errorMessage = signal<string>('');
  readonly isLoading = signal<boolean>(false);

  ngOnChanges() {
    if (this.materia) {
      this.formData.set({
        nombre: this.materia.nombre,
        color: this.materia.color,
        creditos: this.materia.creditos,
        docente: this.materia.docente || '',
      });
    } else {
      this.resetForm();
    }
  }

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const request = this.materia
      ? this.httpService.patch<MateriaResponse>(
          API_ENDPOINTS.materias.update(this.materia.id),
          this.formData()
        )
      : this.httpService.post<MateriaResponse>(
          API_ENDPOINTS.materias.create,
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
          error.error?.message || 'Error al guardar materia'
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
      color: '#003F8A',
      creditos: 4,
      docente: '',
    });
    this.errorMessage.set('');
  }

  updateFormData<K extends keyof (CreateMateriaRequest | UpdateMateriaRequest)>(
    field: K,
    value: (CreateMateriaRequest | UpdateMateriaRequest)[K]
  ) {
    this.formData.update(data => ({ ...data, [field]: value }));
  }
}
