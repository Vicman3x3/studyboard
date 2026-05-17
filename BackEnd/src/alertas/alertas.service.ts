import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, Not } from 'typeorm';
import { Alerta } from './alerta.entity';
import { Tarea } from '../tareas/tarea.entity';

@Injectable()
export class AlertasService {
  constructor(
    @InjectRepository(Alerta)
    private readonly alertaRepo: Repository<Alerta>,
    @InjectRepository(Tarea)
    private readonly tareaRepo: Repository<Tarea>,
  ) {}

  async getAlertas(usuarioId: string) {
    const ahora = new Date();
    const en48Horas = new Date();
    en48Horas.setHours(ahora.getHours() + 48);

    // Buscar tareas próximas no completadas
    const tareasProximas = await this.tareaRepo
      .createQueryBuilder('tarea')
      .leftJoinAndSelect('tarea.materia', 'materia')
      .where('materia.usuarioId = :usuarioId', { usuarioId })
      .andWhere('tarea.estado != :estado', { estado: 'completada' })
      .andWhere('tarea.fechaEntrega IS NOT NULL')
      .andWhere('tarea.fechaEntrega >= :ahora', {
        ahora: ahora.toISOString().split('T')[0],
      })
      .andWhere('tarea.fechaEntrega <= :en48Horas', {
        en48Horas: en48Horas.toISOString().split('T')[0],
      })
      .orderBy('tarea.fechaEntrega', 'ASC')
      .getMany();

    // Crear alertas para tareas que no las tienen
    const tareaIds = tareasProximas.map((t) => t.id);
    const alertasExistentes = await this.alertaRepo.find({
      where: { usuarioId, tareaId: In(tareaIds) },
    });

    const alertasExistentesMap = new Set(
      alertasExistentes.map((a) => a.tareaId),
    );

    for (const tarea of tareasProximas) {
      if (!alertasExistentesMap.has(tarea.id)) {
        const nuevaAlerta = this.alertaRepo.create({
          usuarioId,
          tareaId: tarea.id,
          leida: false,
        });
        await this.alertaRepo.save(nuevaAlerta);
      }
    }

    // Retornar todas las alertas con datos de tarea
    return this.alertaRepo
      .createQueryBuilder('alerta')
      .leftJoinAndSelect('alerta.tarea', 'tarea')
      .leftJoinAndSelect('tarea.materia', 'materia')
      .where('alerta.usuarioId = :usuarioId', { usuarioId })
      .andWhere('tarea.estado != :estado', { estado: 'completada' })
      .andWhere('tarea.fechaEntrega IS NOT NULL')
      .andWhere('tarea.fechaEntrega >= :ahora', {
        ahora: ahora.toISOString().split('T')[0],
      })
      .andWhere('tarea.fechaEntrega <= :en48Horas', {
        en48Horas: en48Horas.toISOString().split('T')[0],
      })
      .orderBy('alerta.leida', 'ASC')
      .addOrderBy('tarea.fechaEntrega', 'ASC')
      .getMany();
  }

  async marcarLeida(alertaId: string, usuarioId: string) {
    const alerta = await this.alertaRepo.findOne({
      where: { id: alertaId, usuarioId },
    });

    if (!alerta) {
      throw new Error('Alerta no encontrada');
    }

    alerta.leida = true;
    return this.alertaRepo.save(alerta);
  }

  async contarNoLeidas(usuarioId: string): Promise<number> {
    const alertas = await this.getAlertas(usuarioId);
    return alertas.filter((a) => !a.leida).length;
  }
}
