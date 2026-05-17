import { PartialType } from '@nestjs/mapped-types';
import { CreateItemTemarioDto } from './create-item-temario.dto';

export class UpdateItemTemarioDto extends PartialType(CreateItemTemarioDto) {}
