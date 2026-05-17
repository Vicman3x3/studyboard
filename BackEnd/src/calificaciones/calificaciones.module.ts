import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionesController } from './calificaciones.controller';
import { CalificacionesService } from './calificaciones.service';
import { CriterioEvaluacion } from './criterio-evaluacion.entity';
import { Calificacion } from './calificacion.entity';
import { Materia } from '../materias/materia.entity';
import { Parcial } from '../temarios/parcial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioEvaluacion, Calificacion, Materia, Parcial])],
  controllers: [CalificacionesController],
  providers: [CalificacionesService],
})
export class CalificacionesModule {}
