import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../auth/usuario.entity';
import { Materia } from '../materias/materia.entity';

export enum EstadoTarea {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en_progreso',
  COMPLETADA = 'completada',
}

export enum PrioridadTarea {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
}

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'text',
    default: EstadoTarea.PENDIENTE,
  })
  estado: EstadoTarea;

  @Column({
    type: 'text',
    default: PrioridadTarea.MEDIA,
  })
  prioridad: PrioridadTarea;

  @Column({ name: 'fecha_entrega', type: 'datetime', nullable: true })
  fechaEntrega: Date;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @ManyToOne(() => Materia, { onDelete: 'CASCADE' })
  materia: Materia;

  @Column({ name: 'materia_id' })
  materiaId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
