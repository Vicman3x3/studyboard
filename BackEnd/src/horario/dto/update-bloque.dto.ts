import { PartialType } from '@nestjs/mapped-types';
import { CreateBloqueDto } from './create-bloque.dto';

export class UpdateBloqueDto extends PartialType(CreateBloqueDto) {}
