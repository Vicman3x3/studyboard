import { Tarea } from '../tablero/tablero.model';

export interface DashboardResumen {
  totalMaterias: number;
  totalTareas: number;
  tareasCompletadas: number;
  tareasPendientes: number;
  promedioGeneral: number;
  tareasProximas: number;
  porcentajeCompletado: number;
}

export interface ResumenResponse {
  data: DashboardResumen;
  message: string;
  statusCode: number;
}

export interface ProximasEntregasResponse {
  data: Tarea[];
  message: string;
  statusCode: number;
}

export interface AccesoRapido {
  titulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
  color: string;
}
