export interface Semestre {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSemestreRequest {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface UpdateSemestreRequest {
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface SemestreResponse {
  data: Semestre;
  message: string;
  statusCode: number;
}

export interface SemestresListResponse {
  data: Semestre[];
  message: string;
  statusCode: number;
}
