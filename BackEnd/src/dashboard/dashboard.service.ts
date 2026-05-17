import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThanOrEqual } from 'typeorm';
import { Materia } from '../materias/materia.entity';
import { Tarea } from '../tareas/tarea.entity';
import { CalificacionesService } from '../calificaciones/calificaciones.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepo: Repository<Materia>,
    @InjectRepository(Tarea)
    private readonly tareaRepo: Repository<Tarea>,
    private readonly calificacionesService: CalificacionesService,
  ) {}

  async getResumen(usuarioId: string) {
    // Contar materias activas
    const totalMaterias = await this.materiaRepo.count({
      where: { usuarioId },
    });

    // Contar tareas por estado
    const tareasQueryBuilder = this.tareaRepo
      .createQueryBuilder('tarea')
      .leftJoin('tarea.materia', 'materia')
      .where('materia.usuarioId = :usuarioId', { usuarioId });

    const totalTareas = await tareasQueryBuilder.getCount();

    const tareasCompletadas = await tareasQueryBuilder
      .andWhere('tarea.estado = :estado', { estado: 'completada' })
      .getCount();

    const tareasPendientes = await this.tareaRepo
      .createQueryBuilder('tarea')
      .leftJoin('tarea.materia', 'materia')
      .where('materia.usuarioId = :usuarioId', { usuarioId })
      .andWhere('tarea.estado IN (:...estados)', { estados: ['pendiente', 'en_progreso'] })
      .getCount();

    // Calcular promedio general de todas las materias
    const materias = await this.materiaRepo.find({ where: { usuarioId } });
    let promedioGeneral = 0;
    let materiasConCalificaciones = 0;

    for (const materia of materias) {
      const promedio = await this.calificacionesService.calcularPromedio(materia.id, usuarioId);
      if (promedio > 0) {
        promedioGeneral += promedio;
        materiasConCalificaciones++;
      }
    }

    if (materiasConCalificaciones > 0) {
      promedioGeneral = promedioGeneral / materiasConCalificaciones;
    }

    // Tareas próximas (próximos 7 días)
    const hoy = new Date();
    const enSieteDias = new Date();
    enSieteDias.setDate(hoy.getDate() + 7);

    const tareasProximas = await this.tareaRepo
      .createQueryBuilder('tarea')
      .leftJoinAndSelect('tarea.materia', 'materia')
      .where('materia.usuarioId = :usuarioId', { usuarioId })
      .andWhere('tarea.estado != :estado', { estado: 'completada' })
      .andWhere('tarea.fechaEntrega IS NOT NULL')
      .andWhere('tarea.fechaEntrega >= :hoy', { hoy: hoy.toISOString().split('T')[0] })
      .andWhere('tarea.fechaEntrega <= :enSieteDias', {
        enSieteDias: enSieteDias.toISOString().split('T')[0],
      })
      .orderBy('tarea.fechaEntrega', 'ASC')
      .getCount();

    return {
      totalMaterias,
      totalTareas,
      tareasCompletadas,
      tareasPendientes,
      promedioGeneral: Number(promedioGeneral.toFixed(2)),
      tareasProximas,
      porcentajeCompletado:
        totalTareas > 0 ? Number(((tareasCompletadas / totalTareas) * 100).toFixed(1)) : 0,
    };
  }

  async getProximasEntregas(usuarioId: string) {
    const hoy = new Date();
    const enSieteDias = new Date();
    enSieteDias.setDate(hoy.getDate() + 7);

    return this.tareaRepo
      .createQueryBuilder('tarea')
      .leftJoinAndSelect('tarea.materia', 'materia')
      .where('materia.usuarioId = :usuarioId', { usuarioId })
      .andWhere('tarea.estado != :estado', { estado: 'completada' })
      .andWhere('tarea.fechaEntrega IS NOT NULL')
      .andWhere('tarea.fechaEntrega >= :hoy', { hoy: hoy.toISOString().split('T')[0] })
      .andWhere('tarea.fechaEntrega <= :enSieteDias', {
        enSieteDias: enSieteDias.toISOString().split('T')[0],
      })
      .orderBy('tarea.fechaEntrega', 'ASC')
      .addOrderBy('tarea.prioridad', 'DESC')
      .take(10)
      .getMany();
  }
}
