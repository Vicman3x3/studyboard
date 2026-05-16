import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from './materia.entity';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';

@Injectable()
export class MateriasService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiasRepo: Repository<Materia>,
  ) {}

  async create(usuarioId: string, createMateriaDto: CreateMateriaDto) {
    const materia = this.materiasRepo.create({
      ...createMateriaDto,
      usuarioId,
    });

    await this.materiasRepo.save(materia);

    return {
      data: materia,
      message: 'Materia creada correctamente',
      statusCode: 201,
    };
  }

  async findAll(usuarioId: string) {
    const materias = await this.materiasRepo.find({
      where: { usuarioId },
      order: { nombre: 'ASC' },
    });

    return {
      data: materias,
      message: 'Materias obtenidas correctamente',
      statusCode: 200,
    };
  }

  async findOne(id: string, usuarioId: string) {
    const materia = await this.materiasRepo.findOne({
      where: { id, usuarioId },
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    return {
      data: materia,
      message: 'Materia obtenida correctamente',
      statusCode: 200,
    };
  }

  async update(
    id: string,
    usuarioId: string,
    updateMateriaDto: UpdateMateriaDto,
  ) {
    const materia = await this.materiasRepo.findOne({
      where: { id, usuarioId },
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    Object.assign(materia, updateMateriaDto);
    await this.materiasRepo.save(materia);

    return {
      data: materia,
      message: 'Materia actualizada correctamente',
      statusCode: 200,
    };
  }

  async remove(id: string, usuarioId: string) {
    const materia = await this.materiasRepo.findOne({
      where: { id, usuarioId },
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    await this.materiasRepo.remove(materia);

    return {
      data: null,
      message: 'Materia eliminada correctamente',
      statusCode: 200,
    };
  }
}
