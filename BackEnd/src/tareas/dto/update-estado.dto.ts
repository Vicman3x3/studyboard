import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoTarea } from '../tarea.entity';

export class UpdateEstadoDto {
  @IsEnum(EstadoTarea)
  @IsNotEmpty()
  estado: EstadoTarea;
}
