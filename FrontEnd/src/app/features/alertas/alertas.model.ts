import { Tarea } from '../tablero/tablero.model';

export interface Alerta {
  id: string;
  usuarioId: string;
  tareaId: string;
  tarea: Tarea;
  leida: boolean;
  fechaCreacion: string;
}

export interface AlertasResponse {
  data: Alerta[];
  message: string;
  statusCode: number;
}

export interface ContarNoLeidasResponse {
  data: { count: number };
  message: string;
  statusCode: number;
}
