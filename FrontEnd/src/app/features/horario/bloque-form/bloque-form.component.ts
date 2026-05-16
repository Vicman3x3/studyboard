import { Component, EventEmitter, Input, Output, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import {
  BloqueHorario,
  BloqueResponse,
  CreateBloqueRequest,
  DIAS_SEMANA,
  DiaSemana,
  HORAS_DIA,
  UpdateBloqueRequest,
} from '../horario.model';

interface BloqueFormData {
  dia: DiaSemana | null;
  horaInicio: string;
  horaFin: string;
  aula: string;
  materiaId: string;
}

@Component({
  selector: 'app-bloque-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    MessageModule,
  ],
  templateUrl: './bloque-form.component.html',
  styleUrl: './bloque-form.component.scss',
})
export class BloqueFormComponent implements OnChanges {
  private readonly httpService = inject(HttpService);

  @Input() visible = false;
  @Input() bloque: BloqueHorario | null = null;
  @Input() materias: any[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();

  readonly formData = signal<BloqueFormData>({
    dia: null,
    horaInicio: '',
    horaFin: '',
    aula: '',
    materiaId: '',
  });

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly diasSemana = DIAS_SEMANA;
  readonly horasDia = HORAS_DIA.map((h) => ({ label: h, value: h }));

  ngOnChanges() {
    if (this.bloque) {
      this.formData.set({
        dia: this.bloque.dia,
        horaInicio: this.bloque.horaInicio,
        horaFin: this.bloque.horaFin,
        aula: this.bloque.aula || '',
        materiaId: this.bloque.materiaId,
      });
    } else {
      this.formData.set({
        dia: null,
        horaInicio: '',
        horaFin: '',
        aula: '',
        materiaId: '',
      });
    }
    this.errorMessage.set(null);
  }

  updateFormData<K extends keyof BloqueFormData>(field: K, value: BloqueFormData[K]) {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  closeDialog() {
    this.onClose.emit();
  }

  onSubmit() {
    const data = this.formData();

    if (!data.dia || !data.horaInicio || !data.horaFin || !data.materiaId) {
      this.errorMessage.set('Todos los campos marcados con * son obligatorios');
      return;
    }

    if (data.horaInicio >= data.horaFin) {
      this.errorMessage.set('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: CreateBloqueRequest | UpdateBloqueRequest = {
      dia: data.dia,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      aula: data.aula || undefined,
      materiaId: data.materiaId,
    };

    const request = this.bloque
      ? this.httpService.patch<BloqueResponse>(API_ENDPOINTS.horario.update(this.bloque.id), payload)
      : this.httpService.post<BloqueResponse>(API_ENDPOINTS.horario.create, payload);

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.onSave.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Error al guardar el bloque de horario');
      },
    });
  }
}
