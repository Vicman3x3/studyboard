import { Component, EventEmitter, Input, Output, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { MessageModule } from 'primeng/message';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import { Parcial, ParcialResponse, CreateParcialRequest, UpdateParcialRequest } from '../temarios.model';

interface ParcialFormData {
  numero: number;
  nombre: string;
  fechaExamen: Date | null;
  materiaId: string;
}

@Component({
  selector: 'app-parcial-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    MessageModule,
  ],
  templateUrl: './parcial-form.component.html',
  styleUrl: './parcial-form.component.scss',
})
export class ParcialFormComponent implements OnChanges {
  private readonly httpService = inject(HttpService);

  @Input() visible = false;
  @Input() parcial: Parcial | null = null;
  @Input() materiaId: string | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();

  readonly formData = signal<ParcialFormData>({
    numero: 1,
    nombre: '',
    fechaExamen: null,
    materiaId: '',
  });

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnChanges() {
    if (this.parcial) {
      this.formData.set({
        numero: this.parcial.numero,
        nombre: this.parcial.nombre,
        fechaExamen: new Date(this.parcial.fechaExamen),
        materiaId: this.parcial.materiaId,
      });
    } else {
      this.formData.set({
        numero: 1,
        nombre: '',
        fechaExamen: null,
        materiaId: this.materiaId || '',
      });
    }
    this.errorMessage.set(null);
  }

  updateFormData<K extends keyof ParcialFormData>(field: K, value: ParcialFormData[K]) {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  closeDialog() {
    this.onClose.emit();
  }

  onSubmit() {
    const data = this.formData();

    if (!data.numero || !data.nombre || !data.fechaExamen || !data.materiaId) {
      this.errorMessage.set('Todos los campos son obligatorios');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: CreateParcialRequest | UpdateParcialRequest = {
      numero: data.numero,
      nombre: data.nombre,
      fechaExamen: data.fechaExamen.toISOString().split('T')[0],
      materiaId: data.materiaId,
    };

    const request = this.parcial
      ? this.httpService.patch<ParcialResponse>(
          API_ENDPOINTS.temarios.parciales.update(this.parcial.id),
          payload
        )
      : this.httpService.post<ParcialResponse>(API_ENDPOINTS.temarios.parciales.create, payload);

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.onSave.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Error al guardar el parcial');
      },
    });
  }
}
