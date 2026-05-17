import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCriterioDto {
  @IsString({ message: 'El nombre debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsNumber({}, { message: 'La ponderación debe ser un número' })
  @IsNotEmpty({ message: 'La ponderación es requerida' })
  @Min(0, { message: 'La ponderación debe ser mayor o igual a 0' })
  @Max(100, { message: 'La ponderación debe ser menor o igual a 100' })
  ponderacion: number;

  @IsString({ message: 'El ID de la materia debe ser una cadena' })
  @IsNotEmpty({ message: 'El ID de la materia es requerido' })
  materiaId: string;
}
