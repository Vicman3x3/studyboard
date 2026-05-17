import { IsNotEmpty, IsString, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreateItemTemarioDto {
  @IsString({ message: 'El tema debe ser una cadena' })
  @IsNotEmpty({ message: 'El tema es requerido' })
  tema: string;

  @IsArray({ message: 'Los subtemas deben ser un arreglo' })
  @IsOptional()
  subtemas?: string[];

  @IsNumber({}, { message: 'El orden debe ser un valor numérico' })
  @IsOptional()
  orden?: number;

  @IsString({ message: 'El ID del parcial debe ser una cadena' })
  @IsNotEmpty({ message: 'El ID del parcial es requerido' })
  parcialId: string;
}
