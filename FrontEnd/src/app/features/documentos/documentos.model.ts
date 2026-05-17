export enum TipoReferencia {
  MATERIA = 'materia',
  TAREA = 'tarea',
  PARCIAL = 'parcial',
}

export interface Documento {
  id: string;
  nombre: string;
  nombreOriginal: string;
  url: string;
  tipo: string;
  tamano: number;
  tipoReferencia: TipoReferencia;
  referenciaId: string;
  usuarioId: string;
  fechaSubida: string;
}

export interface DocumentosResponse {
  data: Documento[];
  message: string;
  statusCode: number;
}

export interface DocumentoResponse {
  data: Documento;
  message: string;
  statusCode: number;
}
