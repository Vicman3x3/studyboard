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
import { ItemTemario } from './item-temario.entity';

@Entity('parciales')
export class Parcial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numero: number;

  @Column()
  nombre: string;

  @Column({ type: 'date', name: 'fecha_examen' })
  fechaExamen: Date;

  @ManyToOne(() => Materia, { onDelete: 'CASCADE' })
  materia: Materia;

  @Column({ name: 'materia_id' })
  materiaId: string;

  @OneToMany(() => ItemTemario, (item) => item.parcial, { cascade: true })
  items: ItemTemario[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
