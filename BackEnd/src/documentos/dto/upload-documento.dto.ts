import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TipoReferencia } from './documento.entity';

export class UploadDocumentoDto {
  @IsEnum(TipoReferencia)
  @IsNotEmpty()
  tipoReferencia: TipoReferencia;

  @IsString()
  @IsNotEmpty()
  referenciaId: string;
}
