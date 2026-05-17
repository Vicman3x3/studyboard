import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Materia } from '../materias/materia.entity';
import { Tarea } from '../tareas/tarea.entity';
import { CalificacionesModule } from '../calificaciones/calificaciones.module';
import { CalificacionesService } from '../calificaciones/calificaciones.service';
import { CriterioEvaluacion } from '../calificaciones/criterio-evaluacion.entity';
import { Calificacion } from '../calificaciones/calificacion.entity';
import { Parcial } from '../temarios/parcial.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Materia, Tarea, CriterioEvaluacion, Calificacion, Parcial]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, CalificacionesService],
})
export class DashboardModule {}
