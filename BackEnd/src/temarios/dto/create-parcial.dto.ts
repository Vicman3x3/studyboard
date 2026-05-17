import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateParcialDto {
  @IsNumber({}, { message: 'El número debe ser un valor numérico' })
  @IsNotEmpty({ message: 'El número es requerido' })
  numero: number;

  @IsString({ message: 'El nombre debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsDateString({}, { message: 'La fecha de examen debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de examen es requerida' })
  fechaExamen: Date;

  @IsString({ message: 'El ID de la materia debe ser una cadena' })
  @IsNotEmpty({ message: 'El ID de la materia es requerido' })
  materiaId: string;
}
