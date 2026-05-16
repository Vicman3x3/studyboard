import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateSemestreDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;
}
