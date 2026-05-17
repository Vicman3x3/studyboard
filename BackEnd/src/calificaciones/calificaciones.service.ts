import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CriterioEvaluacion } from './criterio-evaluacion.entity';
import { Calificacion } from './calificacion.entity';
import { CreateCriterioDto } from './dto/create-criterio.dto';
import { UpdateCriterioDto } from './dto/update-criterio.dto';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { Materia } from '../materias/materia.entity';
import { Parcial } from '../temarios/parcial.entity';

@Injectable()
export class CalificacionesService {
  constructor(
    @InjectRepository(CriterioEvaluacion)
    private readonly criterioRepo: Repository<CriterioEvaluacion>,
    @InjectRepository(Calificacion)
    private readonly calificacionRepo: Repository<Calificacion>,
    @InjectRepository(Materia)
    private readonly materiaRepo: Repository<Materia>,
    @InjectRepository(Parcial)
    private readonly parcialRepo: Repository<Parcial>,
  ) {}

  // === CRITERIOS ===

  async findAllCriterios(usuarioId: string, materiaId?: string): Promise<CriterioEvaluacion[]> {
    const queryBuilder = this.criterioRepo
      .createQueryBuilder('criterio')
      .leftJoinAndSelect('criterio.materia', 'materia')
      .where('materia.usuarioId = :usuarioId', { usuarioId });

    if (materiaId) {
      queryBuilder.andWhere('criterio.materiaId = :materiaId', { materiaId });
    }

    return queryBuilder.getMany();
  }

  async findOneCriterio(id: string, usuarioId: string): Promise<CriterioEvaluacion> {
    const criterio = await this.criterioRepo
      .createQueryBuilder('criterio')
      .leftJoinAndSelect('criterio.materia', 'materia')
      .where('criterio.id = :id', { id })
      .andWhere('materia.usuarioId = :usuarioId', { usuarioId })
      .getOne();

    if (!criterio) {
      throw new NotFoundException('Criterio de evaluación no encontrado');
    }

    return criterio;
  }

  async createCriterio(
    createCriterioDto: CreateCriterioDto,
    usuarioId: string,
  ): Promise<CriterioEvaluacion> {
    const materia = await this.materiaRepo.findOne({
      where: { id: createCriterioDto.materiaId, usuarioId },
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    // Validar que la suma de ponderaciones no exceda 100
    const criteriosExistentes = await this.findAllCriterios(usuarioId, createCriterioDto.materiaId);
    const sumaPonderaciones = criteriosExistentes.reduce((sum, c) => sum + Number(c.ponderacion), 0);

    if (sumaPonderaciones + createCriterioDto.ponderacion > 100) {
      throw new BadRequestException(
        `La suma de ponderaciones no puede exceder 100. Actual: ${sumaPonderaciones}`,
      );
    }

    const criterio = this.criterioRepo.create(createCriterioDto);
    return this.criterioRepo.save(criterio);
  }

  async updateCriterio(
    id: string,
    updateCriterioDto: UpdateCriterioDto,
    usuarioId: string,
  ): Promise<CriterioEvaluacion> {
    const criterio = await this.findOneCriterio(id, usuarioId);

    if (updateCriterioDto.ponderacion) {
      const criteriosExistentes = await this.findAllCriterios(usuarioId, criterio.materiaId);
      const sumaPonderaciones = criteriosExistentes
        .filter((c) => c.id !== id)
        .reduce((sum, c) => sum + Number(c.ponderacion), 0);

      if (sumaPonderaciones + updateCriterioDto.ponderacion > 100) {
        throw new BadRequestException(
          `La suma de ponderaciones no puede exceder 100. Actual sin este criterio: ${sumaPonderaciones}`,
        );
      }
    }

    Object.assign(criterio, updateCriterioDto);
    return this.criterioRepo.save(criterio);
  }

  async removeCriterio(id: string, usuarioId: string): Promise<void> {
    const criterio = await this.findOneCriterio(id, usuarioId);
    await this.criterioRepo.remove(criterio);
  }

  // === CALIFICACIONES ===

  async findAllCalificaciones(
    usuarioId: string,
    materiaId?: string,
    parcialId?: string,
  ): Promise<Calificacion[]> {
    const queryBuilder = this.calificacionRepo
      .createQueryBuilder('calificacion')
      .leftJoinAndSelect('calificacion.criterio', 'criterio')
      .leftJoinAndSelect('calificacion.parcial', 'parcial')
      .leftJoinAndSelect('criterio.materia', 'materia')
      .where('materia.usuarioId = :usuarioId', { usuarioId });

    if (materiaId) {
      queryBuilder.andWhere('criterio.materiaId = :materiaId', { materiaId });
    }

    if (parcialId) {
      queryBuilder.andWhere('calificacion.parcialId = :parcialId', { parcialId });
    }

    return queryBuilder.getMany();
  }

  async findOneCalificacion(id: string, usuarioId: string): Promise<Calificacion> {
    const calificacion = await this.calificacionRepo
      .createQueryBuilder('calificacion')
      .leftJoinAndSelect('calificacion.criterio', 'criterio')
      .leftJoinAndSelect('calificacion.parcial', 'parcial')
      .leftJoinAndSelect('criterio.materia', 'materia')
      .where('calificacion.id = :id', { id })
      .andWhere('materia.usuarioId = :usuarioId', { usuarioId })
      .getOne();

    if (!calificacion) {
      throw new NotFoundException('Calificación no encontrada');
    }

    return calificacion;
  }

  async createCalificacion(
    createCalificacionDto: CreateCalificacionDto,
    usuarioId: string,
  ): Promise<Calificacion> {
    const criterio = await this.findOneCriterio(createCalificacionDto.criterioId, usuarioId);

    if (!criterio) {
      throw new NotFoundException('Criterio no encontrado');
    }

    const parcial = await this.parcialRepo
      .createQueryBuilder('parcial')
      .leftJoinAndSelect('parcial.materia', 'materia')
      .where('parcial.id = :parcialId', { parcialId: createCalificacionDto.parcialId })
      .andWhere('materia.usuarioId = :usuarioId', { usuarioId })
      .getOne();

    if (!parcial) {
      throw new NotFoundException('Parcial no encontrado');
    }

    const calificacion = this.calificacionRepo.create(createCalificacionDto);
    return this.calificacionRepo.save(calificacion);
  }

  async updateCalificacion(
    id: string,
    updateCalificacionDto: UpdateCalificacionDto,
    usuarioId: string,
  ): Promise<Calificacion> {
    const calificacion = await this.findOneCalificacion(id, usuarioId);

    Object.assign(calificacion, updateCalificacionDto);
    return this.calificacionRepo.save(calificacion);
  }

  async removeCalificacion(id: string, usuarioId: string): Promise<void> {
    const calificacion = await this.findOneCalificacion(id, usuarioId);
    await this.calificacionRepo.remove(calificacion);
  }

  // === CÁLCULOS ===

  async calcularPromedio(materiaId: string, usuarioId: string): Promise<number> {
    const calificaciones = await this.findAllCalificaciones(usuarioId, materiaId);

    if (calificaciones.length === 0) {
      return 0;
    }

    let sumaPromedios = 0;
    let sumaPonderaciones = 0;

    // Agrupar por criterio
    const calificacionesPorCriterio = new Map<string, Calificacion[]>();

    for (const calificacion of calificaciones) {
      const criterioId = calificacion.criterioId;
      if (!calificacionesPorCriterio.has(criterioId)) {
        calificacionesPorCriterio.set(criterioId, []);
      }
      calificacionesPorCriterio.get(criterioId)!.push(calificacion);
    }

    // Calcular promedio por criterio y aplicar ponderación
    for (const [criterioId, califs] of calificacionesPorCriterio) {
      const promedioCriterio = califs.reduce((sum, c) => sum + Number(c.valor), 0) / califs.length;
      const ponderacion = Number(califs[0].criterio.ponderacion);

      sumaPromedios += promedioCriterio * (ponderacion / 100);
      sumaPonderaciones += ponderacion;
    }

    return sumaPonderaciones > 0 ? sumaPromedios : 0;
  }

  async calcularProyeccion(
    materiaId: string,
    usuarioId: string,
    notaMinimaDeseada: number = 70,
  ): Promise<{ notaNecesaria: number; esPosible: boolean }> {
    const criterios = await this.findAllCriterios(usuarioId, materiaId);
    const calificaciones = await this.findAllCalificaciones(usuarioId, materiaId);

    const ponderacionTotal = criterios.reduce((sum, c) => sum + Number(c.ponderacion), 0);
    const ponderacionFaltante = 100 - ponderacionTotal;

    if (ponderacionFaltante === 0) {
      const promedioActual = await this.calcularPromedio(materiaId, usuarioId);
      return {
        notaNecesaria: 0,
        esPosible: promedioActual >= notaMinimaDeseada,
      };
    }

    const calificacionesPorCriterio = new Map<string, Calificacion[]>();
    for (const calificacion of calificaciones) {
      const criterioId = calificacion.criterioId;
      if (!calificacionesPorCriterio.has(criterioId)) {
        calificacionesPorCriterio.set(criterioId, []);
      }
      calificacionesPorCriterio.get(criterioId)!.push(calificacion);
    }

    let puntosAcumulados = 0;
    let ponderacionRestante = ponderacionFaltante;

    for (const criterio of criterios) {
      const califs = calificacionesPorCriterio.get(criterio.id) || [];
      if (califs.length > 0) {
        const promedio = califs.reduce((sum, c) => sum + Number(c.valor), 0) / califs.length;
        puntosAcumulados += promedio * (Number(criterio.ponderacion) / 100);
      } else {
        ponderacionRestante = Number(criterio.ponderacion);
      }
    }

    const puntosNecesarios = notaMinimaDeseada - puntosAcumulados;
    const notaNecesaria = ponderacionRestante > 0 ? (puntosNecesarios / ponderacionRestante) * 100 : 0;

    return {
      notaNecesaria: Math.max(0, notaNecesaria),
      esPosible: notaNecesaria <= 100,
    };
  }
}
