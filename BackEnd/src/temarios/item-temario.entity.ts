import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Parcial } from './parcial.entity';

@Entity('items_temario')
export class ItemTemario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tema: string;

  @Column({ type: 'simple-array', nullable: true })
  subtemas: string[];

  @Column({ default: 0 })
  orden: number;

  @ManyToOne(() => Parcial, (parcial) => parcial.items, { onDelete: 'CASCADE' })
  parcial: Parcial;

  @Column({ name: 'parcial_id' })
  parcialId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
