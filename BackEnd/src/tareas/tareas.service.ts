import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareasRepo: Repository<Tarea>,
  ) {}

  async create(usuarioId: string, createTareaDto: CreateTareaDto) {
    const tarea = this.tareasRepo.create({
      ...createTareaDto,
      usuarioId,
    });

    await this.tareasRepo.save(tarea);

    return {
      data: tarea,
      message: 'Tarea creada correctamente',
      statusCode: 201,
    };
  }

  async findAll(usuarioId: string, materiaId?: string) {
    const where: any = { usuarioId };

    if (materiaId) {
      where.materiaId = materiaId;
    }

    const tareas = await this.tareasRepo.find({
      where,
      relations: ['materia'],
      order: { createdAt: 'DESC' },
    });

    return {
      data: tareas,
      message: 'Tareas obtenidas correctamente',
      statusCode: 200,
    };
  }

  async findOne(id: string, usuarioId: string) {
    const tarea = await this.tareasRepo.findOne({
      where: { id, usuarioId },
      relations: ['materia'],
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    return {
      data: tarea,
      message: 'Tarea obtenida correctamente',
      statusCode: 200,
    };
  }

  async update(id: string, usuarioId: string, updateTareaDto: UpdateTareaDto) {
    const tarea = await this.tareasRepo.findOne({
      where: { id, usuarioId },
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    Object.assign(tarea, updateTareaDto);
    await this.tareasRepo.save(tarea);

    return {
      data: tarea,
      message: 'Tarea actualizada correctamente',
      statusCode: 200,
    };
  }

  async updateEstado(
    id: string,
    usuarioId: string,
    updateEstadoDto: UpdateEstadoDto,
  ) {
    const tarea = await this.tareasRepo.findOne({
      where: { id, usuarioId },
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    tarea.estado = updateEstadoDto.estado;
    await this.tareasRepo.save(tarea);

    return {
      data: tarea,
      message: 'Estado de tarea actualizado correctamente',
      statusCode: 200,
    };
  }

  async remove(id: string, usuarioId: string) {
    const tarea = await this.tareasRepo.findOne({
      where: { id, usuarioId },
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    await this.tareasRepo.remove(tarea);

    return {
      data: null,
      message: 'Tarea eliminada correctamente',
      statusCode: 200,
    };
  }
}
