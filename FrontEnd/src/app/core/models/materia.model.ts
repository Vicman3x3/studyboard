export interface Materia {
  id: string;
  nombre: string;
  color: string;
  creditos: number;
  docente?: string;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMateriaRequest {
  nombre: string;
  color: string;
  creditos: number;
  docente?: string;
}

export interface UpdateMateriaRequest {
  nombre?: string;
  color?: string;
  creditos?: number;
  docente?: string;
}

export interface MateriaResponse {
  data: Materia;
  message: string;
  statusCode: number;
}

export interface MateriasListResponse {
  data: Materia[];
  message: string;
  statusCode: number;
}
