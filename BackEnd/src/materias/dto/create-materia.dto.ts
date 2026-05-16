import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional, Matches } from 'class-validator';

export class CreateMateriaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'El color debe ser un código hexadecimal válido (ej: #FF5733)' })
  color: string;

  @IsInt()
  @Min(1)
  @Max(20)
  creditos: number;

  @IsString()
  @IsOptional()
  docente?: string;
}
