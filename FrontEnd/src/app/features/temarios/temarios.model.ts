import { Materia } from '../materias/materia.model';

export interface Parcial {
  id: string;
  numero: number;
  nombre: string;
  fechaExamen: Date;
  materiaId: string;
  materia: Materia;
  items: ItemTemario[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemTemario {
  id: string;
  tema: string;
  subtemas: string[];
  orden: number;
  parcialId: string;
  parcial: Parcial;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateParcialRequest {
  numero: number;
  nombre: string;
  fechaExamen: Date | string;
  materiaId: string;
}

export interface UpdateParcialRequest {
  numero?: number;
  nombre?: string;
  fechaExamen?: Date | string;
  materiaId?: string;
}

export interface CreateItemTemarioRequest {
  tema: string;
  subtemas?: string[];
  orden?: number;
  parcialId: string;
}

export interface UpdateItemTemarioRequest {
  tema?: string;
  subtemas?: string[];
  orden?: number;
  parcialId?: string;
}

export interface ParcialResponse {
  data: Parcial;
  message: string;
  statusCode: number;
}

export interface ParcialesListResponse {
  data: Parcial[];
  message: string;
  statusCode: number;
}

export interface ItemTemarioResponse {
  data: ItemTemario;
  message: string;
  statusCode: number;
}

export interface ItemsTemarioListResponse {
  data: ItemTemario[];
  message: string;
  statusCode: number;
}
