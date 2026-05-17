import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertasController } from './alertas.controller';
import { AlertasService } from './alertas.service';
import { Alerta } from './alerta.entity';
import { Tarea } from '../tareas/tarea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alerta, Tarea])],
  controllers: [AlertasController],
  providers: [AlertasService],
  exports: [AlertasService],
})
export class AlertasModule {}
