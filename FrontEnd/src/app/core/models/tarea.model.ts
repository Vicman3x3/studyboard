import { Materia } from './materia.model';

export enum EstadoTarea {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en_progreso',
  COMPLETADA = 'completada',
}

export enum PrioridadTarea {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  estado: EstadoTarea;
  prioridad: PrioridadTarea;
  fechaEntrega?: string;
  usuarioId: string;
  materiaId: string;
  materia?: Materia;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTareaRequest {
  titulo: string;
  descripcion?: string;
  prioridad?: PrioridadTarea;
  fechaEntrega?: string;
  materiaId: string;
}

export interface UpdateTareaRequest {
  titulo?: string;
  descripcion?: string;
  prioridad?: PrioridadTarea;
  fechaEntrega?: string;
  materiaId?: string;
}

export interface UpdateEstadoRequest {
  estado: EstadoTarea;
}

export interface TareaResponse {
  data: Tarea;
  message: string;
  statusCode: number;
}

export interface TareasListResponse {
  data: Tarea[];
  message: string;
  statusCode: number;
}
