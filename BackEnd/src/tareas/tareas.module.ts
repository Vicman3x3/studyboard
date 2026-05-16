import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { Tarea } from './tarea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea])],
  controllers: [TareasController],
  providers: [TareasService],
  exports: [TareasService],
})
export class TareasModule {}
