import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioController } from './horario.controller';
import { HorarioService } from './horario.service';
import { BloqueHorario } from './bloque-horario.entity';
import { Materia } from '../materias/materia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BloqueHorario, Materia])],
  controllers: [HorarioController],
  providers: [HorarioService],
})
export class HorarioModule {}
