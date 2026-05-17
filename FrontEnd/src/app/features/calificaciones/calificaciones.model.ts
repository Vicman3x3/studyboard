import { Materia } from '../materias/materia.model';
import { Parcial } from '../temarios/temarios.model';

export interface CriterioEvaluacion {
  id: string;
  nombre: string;
  ponderacion: number;
  materiaId: string;
  materia: Materia;
  createdAt: Date;
  updatedAt: Date;
}

export interface Calificacion {
  id: string;
  valor: number;
  criterioId: string;
  criterio: CriterioEvaluacion;
  parcialId: string;
  parcial: Parcial;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCriterioRequest {
  nombre: string;
  ponderacion: number;
  materiaId: string;
}

export interface UpdateCriterioRequest {
  nombre?: string;
  ponderacion?: number;
  materiaId?: string;
}

export interface CreateCalificacionRequest {
  valor: number;
  criterioId: string;
  parcialId: string;
}

export interface UpdateCalificacionRequest {
  valor?: number;
  criterioId?: string;
  parcialId?: string;
}

export interface CriterioResponse {
  data: CriterioEvaluacion;
  message: string;
  statusCode: number;
}

export interface CriteriosListResponse {
  data: CriterioEvaluacion[];
  message: string;
  statusCode: number;
}

export interface CalificacionResponse {
  data: Calificacion;
  message: string;
  statusCode: number;
}

export interface CalificacionesListResponse {
  data: Calificacion[];
  message: string;
  statusCode: number;
}

export interface PromedioResponse {
  data: { promedio: number };
  message: string;
  statusCode: number;
}

export interface ProyeccionResponse {
  data: {
    notaNecesaria: number;
    esPosible: boolean;
  };
  message: string;
  statusCode: number;
}
