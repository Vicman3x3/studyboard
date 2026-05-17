import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CriterioEvaluacion } from './criterio-evaluacion.entity';
import { Parcial } from '../temarios/parcial.entity';

@Entity('calificaciones')
export class Calificacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  valor: number;

  @ManyToOne(() => CriterioEvaluacion, (criterio) => criterio.calificaciones, {
    onDelete: 'CASCADE',
    eager: true,
  })
  criterio: CriterioEvaluacion;

  @Column({ name: 'criterio_id' })
  criterioId: string;

  @ManyToOne(() => Parcial, { onDelete: 'CASCADE', eager: true })
  parcial: Parcial;

  @Column({ name: 'parcial_id' })
  parcialId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
