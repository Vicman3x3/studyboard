import { PartialType } from '@nestjs/mapped-types';
import { CreateParcialDto } from './create-parcial.dto';

export class UpdateParcialDto extends PartialType(CreateParcialDto) {}
