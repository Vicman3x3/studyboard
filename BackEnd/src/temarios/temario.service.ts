import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcial } from './parcial.entity';
import { ItemTemario } from './item-temario.entity';
import { CreateParcialDto } from './dto/create-parcial.dto';
import { UpdateParcialDto } from './dto/update-parcial.dto';
import { CreateItemTemarioDto } from './dto/create-item-temario.dto';
import { UpdateItemTemarioDto } from './dto/update-item-temario.dto';
import { Materia } from '../materias/materia.entity';

@Injectable()
export class TemarioService {
  constructor(
    @InjectRepository(Parcial)
    private readonly parcialRepo: Repository<Parcial>,
    @InjectRepository(ItemTemario)
    private readonly itemRepo: Repository<ItemTemario>,
    @InjectRepository(Materia)
    private readonly materiaRepo: Repository<Materia>,
  ) {}

  // === PARCIALES ===

  async findAllParciales(usuarioId: string, materiaId?: string): Promise<Parcial[]> {
    const queryBuilder = this.parcialRepo
      .createQueryBuilder('parcial')
      .leftJoinAndSelect('parcial.materia', 'materia')
      .leftJoinAndSelect('parcial.items', 'items')
      .where('materia.usuarioId = :usuarioId', { usuarioId })
      .orderBy('parcial.numero', 'ASC')
      .addOrderBy('items.orden', 'ASC');

    if (materiaId) {
      queryBuilder.andWhere('parcial.materiaId = :materiaId', { materiaId });
    }

    return queryBuilder.getMany();
  }

  async findOneParcial(id: string, usuarioId: string): Promise<Parcial> {
    const parcial = await this.parcialRepo
      .createQueryBuilder('parcial')
      .leftJoinAndSelect('parcial.materia', 'materia')
      .leftJoinAndSelect('parcial.items', 'items')
      .where('parcial.id = :id', { id })
      .andWhere('materia.usuarioId = :usuarioId', { usuarioId })
      .orderBy('items.orden', 'ASC')
      .getOne();

    if (!parcial) {
      throw new NotFoundException('Parcial no encontrado');
    }

    return parcial;
  }

  async createParcial(createParcialDto: CreateParcialDto, usuarioId: string): Promise<Parcial> {
    const materia = await this.materiaRepo.findOne({
      where: { id: createParcialDto.materiaId, usuarioId },
    });

    if (!materia) {
      throw new NotFoundException('Materia no encontrada');
    }

    const parcial = this.parcialRepo.create(createParcialDto);
    return this.parcialRepo.save(parcial);
  }

  async updateParcial(
    id: string,
    updateParcialDto: UpdateParcialDto,
    usuarioId: string,
  ): Promise<Parcial> {
    const parcial = await this.findOneParcial(id, usuarioId);

    if (updateParcialDto.materiaId && updateParcialDto.materiaId !== parcial.materiaId) {
      const materia = await this.materiaRepo.findOne({
        where: { id: updateParcialDto.materiaId, usuarioId },
      });

      if (!materia) {
        throw new NotFoundException('Materia no encontrada');
      }
    }

    Object.assign(parcial, updateParcialDto);
    return this.parcialRepo.save(parcial);
  }

  async removeParcial(id: string, usuarioId: string): Promise<void> {
    const parcial = await this.findOneParcial(id, usuarioId);
    await this.parcialRepo.remove(parcial);
  }

  // === ITEMS TEMARIO ===

  async findAllItems(usuarioId: string, parcialId?: string): Promise<ItemTemario[]> {
    const queryBuilder = this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.parcial', 'parcial')
      .leftJoinAndSelect('parcial.materia', 'materia')
      .where('materia.usuarioId = :usuarioId', { usuarioId })
      .orderBy('item.orden', 'ASC');

    if (parcialId) {
      queryBuilder.andWhere('item.parcialId = :parcialId', { parcialId });
    }

    return queryBuilder.getMany();
  }

  async findOneItem(id: string, usuarioId: string): Promise<ItemTemario> {
    const item = await this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.parcial', 'parcial')
      .leftJoinAndSelect('parcial.materia', 'materia')
      .where('item.id = :id', { id })
      .andWhere('materia.usuarioId = :usuarioId', { usuarioId })
      .getOne();

    if (!item) {
      throw new NotFoundException('Item de temario no encontrado');
    }

    return item;
  }

  async createItem(createItemDto: CreateItemTemarioDto, usuarioId: string): Promise<ItemTemario> {
    const parcial = await this.findOneParcial(createItemDto.parcialId, usuarioId);

    if (!parcial) {
      throw new NotFoundException('Parcial no encontrado');
    }

    // Si no se especifica orden, asignar el siguiente disponible
    if (createItemDto.orden === undefined) {
      const maxOrden = await this.itemRepo
        .createQueryBuilder('item')
        .select('MAX(item.orden)', 'max')
        .where('item.parcialId = :parcialId', { parcialId: createItemDto.parcialId })
        .getRawOne();

      createItemDto.orden = (maxOrden?.max ?? -1) + 1;
    }

    const item = this.itemRepo.create(createItemDto);
    return this.itemRepo.save(item);
  }

  async updateItem(
    id: string,
    updateItemDto: UpdateItemTemarioDto,
    usuarioId: string,
  ): Promise<ItemTemario> {
    const item = await this.findOneItem(id, usuarioId);

    if (updateItemDto.parcialId && updateItemDto.parcialId !== item.parcialId) {
      const parcial = await this.findOneParcial(updateItemDto.parcialId, usuarioId);

      if (!parcial) {
        throw new NotFoundException('Parcial no encontrado');
      }
    }

    Object.assign(item, updateItemDto);
    return this.itemRepo.save(item);
  }

  async removeItem(id: string, usuarioId: string): Promise<void> {
    const item = await this.findOneItem(id, usuarioId);
    await this.itemRepo.remove(item);
  }
}
