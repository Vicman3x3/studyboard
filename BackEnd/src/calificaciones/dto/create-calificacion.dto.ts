import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCalificacionDto {
  @IsNumber({}, { message: 'El valor debe ser un número' })
  @IsNotEmpty({ message: 'El valor es requerido' })
  @Min(0, { message: 'La calificación debe ser mayor o igual a 0' })
  @Max(100, { message: 'La calificación debe ser menor o igual a 100' })
  valor: number;

  @IsString({ message: 'El ID del criterio debe ser una cadena' })
  @IsNotEmpty({ message: 'El ID del criterio es requerido' })
  criterioId: string;

  @IsString({ message: 'El ID del parcial debe ser una cadena' })
  @IsNotEmpty({ message: 'El ID del parcial es requerido' })
  parcialId: string;
}
