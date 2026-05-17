import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemarioController } from './temario.controller';
import { TemarioService } from './temario.service';
import { Parcial } from './parcial.entity';
import { ItemTemario } from './item-temario.entity';
import { Materia } from '../materias/materia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parcial, ItemTemario, Materia])],
  controllers: [TemarioController],
  providers: [TemarioService],
})
export class TemarioModule {}
