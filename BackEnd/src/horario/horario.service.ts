import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloqueHorario } from './bloque-horario.entity';
import { CreateBloqueDto } from './dto/create-bloque.dto';
import { UpdateBloqueDto } from './dto/update-bloque.dto';
import { Materia } from '../materias/materia.entity';

@Injectable()
export class HorarioService {
  constructor(
    @InjectRepository(BloqueHorario)
    private readonly bloqueRepo: Repository<BloqueHorario>,
    @InjectRepository(Materia)
    private readonly materiaRepo: Repository<Materia>,
  ) {}

  async findAll(usuarioId: string, materiaId?: string): Promise<BloqueHorario[]> {
    const queryBuilder = this.bloqueRepo
      .createQueryBuilder('bloque')
      .leftJoinAndSelect('bloque.materia', 'materia')
      .where('materia.usuarioId = :usuarioId', { usuarioId });

    if (materiaId) {
      queryBuilder.andWhere('bloque.materiaId = :materiaId', { materiaId });
    }

    return queryBuilder
      .orderBy('CASE bloque.dia WHEN "lunes" THEN 1 WHEN "martes" THEN 2 WHEN "miercoles" THEN 3 WHEN "jueves" THEN 4 WHEN "viernes" THEN 5 WHEN "sabado" THEN 6 END')
      .addOrderBy('bloque.horaInicio', 'ASC')
      .getMany();
  }

  async findOne(id: string, usuarioId: string): Promise<BloqueHorario> {
    const bloque = await this.bloqueRepo
      .createQueryBuilder('bloque')
      .leftJoinAndSelect('bloque.materia', 'materia')
      .where('bloque.id = :id', { id })
      .andWhere('materia.usuarioId = :usuarioId', { usuarioId })
      .getOne();

    if (!bloque) {
      throw new NotFoundException('Bloque de horario no encontrado');
    }

    return bloque;
  }

  async create(createBloqueDto: CreateBloqueDto, usuarioId: string): Promise<BloqueHorario> {
    const materia = await this.materiaRepo.findOne({
      where: { id: createBloqueDto.materiaId, usuarioId },
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    if (createBloqueDto.horaInicio >= createBloqueDto.horaFin) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
    }

    const bloque = this.bloqueRepo.create(createBloqueDto);
    return this.bloqueRepo.save(bloque);
  }

  async update(
    id: string,
    updateBloqueDto: UpdateBloqueDto,
    usuarioId: string,
  ): Promise<BloqueHorario> {
    const bloque = await this.findOne(id, usuarioId);

    if (updateBloqueDto.materiaId && updateBloqueDto.materiaId !== bloque.materiaId) {
      const materia = await this.materiaRepo.findOne({
        where: { id: updateBloqueDto.materiaId, usuarioId },
      });

      if (!materia) {
        throw new NotFoundException('Materia no encontrada');
      }
    }

    const horaInicio = updateBloqueDto.horaInicio || bloque.horaInicio;
    const horaFin = updateBloqueDto.horaFin || bloque.horaFin;

    if (horaInicio >= horaFin) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
    }

    Object.assign(bloque, updateBloqueDto);
    return this.bloqueRepo.save(bloque);
  }

  async remove(id: string, usuarioId: string): Promise<void> {
    const bloque = await this.findOne(id, usuarioId);
    await this.bloqueRepo.remove(bloque);
  }
}
