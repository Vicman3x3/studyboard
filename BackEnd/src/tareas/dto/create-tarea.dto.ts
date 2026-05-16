import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { EstadoTarea, PrioridadTarea } from '../tarea.entity';

export class CreateTareaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(PrioridadTarea)
  @IsOptional()
  prioridad?: PrioridadTarea;

  @IsDateString()
  @IsOptional()
  fechaEntrega?: string;

  @IsUUID()
  @IsNotEmpty()
  materiaId: string;
}
