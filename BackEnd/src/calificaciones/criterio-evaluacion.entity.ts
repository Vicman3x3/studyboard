import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Materia } from '../materias/materia.entity';
import { Calificacion } from './calificacion.entity';

@Entity('criterios_evaluacion')
export class CriterioEvaluacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  ponderacion: number;

  @ManyToOne(() => Materia, { onDelete: 'CASCADE' })
  materia: Materia;

  @Column({ name: 'materia_id' })
  materiaId: string;

  @OneToMany(() => Calificacion, (calificacion) => calificacion.criterio)
  calificaciones: Calificacion[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
