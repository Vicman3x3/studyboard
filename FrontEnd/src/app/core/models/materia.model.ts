export interface Materia {
  id: string;
  nombre: string;
  color: string;
  creditos: number;
  docente?: string;
  usuarioId: string;
  semestreId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMateriaRequest {
  nombre: string;
  color: string;
  creditos: number;
  docente?: string;
  semestreId?: string;
}

export interface UpdateMateriaRequest {
  nombre?: string;
  color?: string;
  creditos?: number;
  docente?: string;
  semestreId?: string;
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
