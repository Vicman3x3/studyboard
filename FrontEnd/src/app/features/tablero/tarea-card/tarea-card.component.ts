import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { Tarea, PrioridadTarea } from '../../../core/models/tarea.model';

@Component({
  selector: 'app-tarea-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, ChipModule, TagModule],
  templateUrl: './tarea-card.component.html',
  styleUrl: './tarea-card.component.scss',
})
export class TareaCardComponent {
  @Input() tarea!: Tarea;
  @Output() onEdit = new EventEmitter<Tarea>();

  readonly PrioridadTarea = PrioridadTarea;

  getPrioridadSeverity(prioridad: PrioridadTarea): 'danger' | 'warning' | 'info' {
    switch (prioridad) {
      case PrioridadTarea.ALTA:
        return 'danger';
      case PrioridadTarea.MEDIA:
        return 'warning';
      case PrioridadTarea.BAJA:
        return 'info';
    }
  }

  getPrioridadLabel(prioridad: PrioridadTarea): string {
    switch (prioridad) {
      case PrioridadTarea.ALTA:
        return 'Alta';
      case PrioridadTarea.MEDIA:
        return 'Media';
      case PrioridadTarea.BAJA:
        return 'Baja';
    }
  }

  editTarea() {
    this.onEdit.emit(this.tarea);
  }

  isOverdue(): boolean {
    if (!this.tarea.fechaEntrega) return false;
    return new Date(this.tarea.fechaEntrega) < new Date();
  }
}
