import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { DiaSemana } from '../bloque-horario.entity';

export class CreateBloqueDto {
  @IsEnum(DiaSemana, { message: 'El día debe ser un día válido de la semana' })
  @IsNotEmpty({ message: 'El día es requerido' })
  dia: DiaSemana;

  @IsString({ message: 'La hora de inicio debe ser una cadena' })
  @IsNotEmpty({ message: 'La hora de inicio es requerida' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de inicio debe tener formato HH:mm',
  })
  horaInicio: string;

  @IsString({ message: 'La hora de fin debe ser una cadena' })
  @IsNotEmpty({ message: 'La hora de fin es requerida' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de fin debe tener formato HH:mm',
  })
  horaFin: string;

  @IsString({ message: 'El aula debe ser una cadena' })
  @IsOptional()
  aula?: string;

  @IsString({ message: 'El ID de la materia debe ser una cadena' })
  @IsNotEmpty({ message: 'El ID de la materia es requerido' })
  materiaId: string;
}
