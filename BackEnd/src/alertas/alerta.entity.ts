import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../auth/usuario.entity';
import { Tarea } from '../tareas/tarea.entity';

@Entity('alertas')
export class Alerta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @ManyToOne(() => Tarea, { onDelete: 'CASCADE' })
  tarea: Tarea;

  @Column({ name: 'tarea_id' })
  tareaId: string;

  @Column({ default: false })
  leida: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
