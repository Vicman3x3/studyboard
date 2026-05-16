import { Materia } from '../materias/materia.model';

export enum DiaSemana {
  LUNES = 'lunes',
  MARTES = 'martes',
  MIERCOLES = 'miercoles',
  JUEVES = 'jueves',
  VIERNES = 'viernes',
  SABADO = 'sabado',
}

export interface BloqueHorario {
  id: string;
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
  aula: string;
  materiaId: string;
  materia: Materia;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBloqueRequest {
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
  aula?: string;
  materiaId: string;
}

export interface UpdateBloqueRequest {
  dia?: DiaSemana;
  horaInicio?: string;
  horaFin?: string;
  aula?: string;
  materiaId?: string;
}

export interface BloqueResponse {
  data: BloqueHorario;
  message: string;
  statusCode: number;
}

export interface BloquesListResponse {
  data: BloqueHorario[];
  message: string;
  statusCode: number;
}

export const DIAS_SEMANA = [
  { label: 'Lunes', value: DiaSemana.LUNES },
  { label: 'Martes', value: DiaSemana.MARTES },
  { label: 'Miércoles', value: DiaSemana.MIERCOLES },
  { label: 'Jueves', value: DiaSemana.JUEVES },
  { label: 'Viernes', value: DiaSemana.VIERNES },
  { label: 'Sábado', value: DiaSemana.SABADO },
];

export const HORAS_DIA = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00',
];
