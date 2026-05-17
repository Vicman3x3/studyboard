import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../auth/usuario.entity';

export enum TipoReferencia {
  MATERIA = 'materia',
  TAREA = 'tarea',
  PARCIAL = 'parcial',
}

@Entity('documentos')
export class Documento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ name: 'nombre_original' })
  nombreOriginal: string;

  @Column()
  url: string;

  @Column()
  tipo: string; // MIME type

  @Column()
  tamano: number; // bytes

  @Column({
    type: 'text',
    name: 'tipo_referencia',
  })
  tipoReferencia: TipoReferencia;

  @Column({ name: 'referencia_id' })
  referenciaId: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @CreateDateColumn({ name: 'fecha_subida' })
  fechaSubida: Date;
}
