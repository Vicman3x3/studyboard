import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Materia } from '../materias/materia.entity';

export enum DiaSemana {
  LUNES = 'lunes',
  MARTES = 'martes',
  MIERCOLES = 'miercoles',
  JUEVES = 'jueves',
  VIERNES = 'viernes',
  SABADO = 'sabado',
}

@Entity('bloques_horario')
export class BloqueHorario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  dia: DiaSemana;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @Column({ nullable: true })
  aula: string;

  @ManyToOne(() => Materia, { onDelete: 'CASCADE', eager: true })
  materia: Materia;

  @Column({ name: 'materia_id' })
  materiaId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
