import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semestre } from './semestre.entity';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';

@Injectable()
export class SemestresService {
  constructor(
    @InjectRepository(Semestre)
    private readonly semestresRepo: Repository<Semestre>,
  ) {}

  async create(usuarioId: string, createSemestreDto: CreateSemestreDto) {
    const semestre = this.semestresRepo.create({
      ...createSemestreDto,
      usuarioId,
    });

    await this.semestresRepo.save(semestre);

    return {
      data: semestre,
      message: 'Semestre creado correctamente',
      statusCode: 201,
    };
  }

  async findAll(usuarioId: string) {
    const semestres = await this.semestresRepo.find({
      where: { usuarioId },
      order: { fechaInicio: 'DESC' },
    });

    return {
      data: semestres,
      message: 'Semestres obtenidos correctamente',
      statusCode: 200,
    };
  }

  async findOne(id: string, usuarioId: string) {
    const semestre = await this.semestresRepo.findOne({
      where: { id, usuarioId },
      relations: ['materias'],
    });

    if (!semestre) {
      throw new NotFoundException('Semestre no encontrado');
    }

    return {
      data: semestre,
      message: 'Semestre obtenido correctamente',
      statusCode: 200,
    };
  }

  async update(
    id: string,
    usuarioId: string,
    updateSemestreDto: UpdateSemestreDto,
  ) {
    const semestre = await this.semestresRepo.findOne({
      where: { id, usuarioId },
    });

    if (!semestre) {
      throw new NotFoundException('Semestre no encontrado');
    }

    Object.assign(semestre, updateSemestreDto);
    await this.semestresRepo.save(semestre);

    return {
      data: semestre,
      message: 'Semestre actualizado correctamente',
      statusCode: 200,
    };
  }

  async activar(id: string, usuarioId: string) {
    const semestre = await this.semestresRepo.findOne({
      where: { id, usuarioId },
    });

    if (!semestre) {
      throw new NotFoundException('Semestre no encontrado');
    }

    // Desactivar todos los semestres del usuario
    await this.semestresRepo.update({ usuarioId }, { activo: false });

    // Activar el semestre seleccionado
    semestre.activo = true;
    await this.semestresRepo.save(semestre);

    return {
      data: semestre,
      message: 'Semestre activado correctamente',
      statusCode: 200,
    };
  }

  async remove(id: string, usuarioId: string) {
    const semestre = await this.semestresRepo.findOne({
      where: { id, usuarioId },
      relations: ['materias'],
    });

    if (!semestre) {
      throw new NotFoundException('Semestre no encontrado');
    }

    if (semestre.materias && semestre.materias.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar un semestre con materias asociadas',
      );
    }

    await this.semestresRepo.remove(semestre);

    return {
      data: null,
      message: 'Semestre eliminado correctamente',
      statusCode: 200,
    };
  }
}
