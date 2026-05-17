import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TemarioService } from './temario.service';
import { CreateParcialDto } from './dto/create-parcial.dto';
import { UpdateParcialDto } from './dto/update-parcial.dto';
import { CreateItemTemarioDto } from './dto/create-item-temario.dto';
import { UpdateItemTemarioDto } from './dto/update-item-temario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/temarios')
@UseGuards(JwtAuthGuard)
export class TemarioController {
  constructor(private readonly temarioService: TemarioService) {}

  // === PARCIALES ===

  @Get('parciales')
  async findAllParciales(@Request() req, @Query('materia_id') materiaId?: string) {
    const parciales = await this.temarioService.findAllParciales(req.user.id, materiaId);
    return {
      data: parciales,
      message: 'Parciales obtenidos exitosamente',
      statusCode: 200,
    };
  }

  @Get('parciales/:id')
  async findOneParcial(@Param('id') id: string, @Request() req) {
    const parcial = await this.temarioService.findOneParcial(id, req.user.id);
    return {
      data: parcial,
      message: 'Parcial obtenido exitosamente',
      statusCode: 200,
    };
  }

  @Post('parciales')
  async createParcial(@Body() createParcialDto: CreateParcialDto, @Request() req) {
    const parcial = await this.temarioService.createParcial(createParcialDto, req.user.id);
    return {
      data: parcial,
      message: 'Parcial creado exitosamente',
      statusCode: 201,
    };
  }

  @Patch('parciales/:id')
  async updateParcial(
    @Param('id') id: string,
    @Body() updateParcialDto: UpdateParcialDto,
    @Request() req,
  ) {
    const parcial = await this.temarioService.updateParcial(id, updateParcialDto, req.user.id);
    return {
      data: parcial,
      message: 'Parcial actualizado exitosamente',
      statusCode: 200,
    };
  }

  @Delete('parciales/:id')
  async removeParcial(@Param('id') id: string, @Request() req) {
    await this.temarioService.removeParcial(id, req.user.id);
    return {
      data: null,
      message: 'Parcial eliminado exitosamente',
      statusCode: 200,
    };
  }

  // === ITEMS TEMARIO ===

  @Get('items')
  async findAllItems(@Request() req, @Query('parcial_id') parcialId?: string) {
    const items = await this.temarioService.findAllItems(req.user.id, parcialId);
    return {
      data: items,
      message: 'Items de temario obtenidos exitosamente',
      statusCode: 200,
    };
  }

  @Get('items/:id')
  async findOneItem(@Param('id') id: string, @Request() req) {
    const item = await this.temarioService.findOneItem(id, req.user.id);
    return {
      data: item,
      message: 'Item de temario obtenido exitosamente',
      statusCode: 200,
    };
  }

  @Post('items')
  async createItem(@Body() createItemDto: CreateItemTemarioDto, @Request() req) {
    const item = await this.temarioService.createItem(createItemDto, req.user.id);
    return {
      data: item,
      message: 'Item de temario creado exitosamente',
      statusCode: 201,
    };
  }

  @Patch('items/:id')
  async updateItem(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemTemarioDto,
    @Request() req,
  ) {
    const item = await this.temarioService.updateItem(id, updateItemDto, req.user.id);
    return {
      data: item,
      message: 'Item de temario actualizado exitosamente',
      statusCode: 200,
    };
  }

  @Delete('items/:id')
  async removeItem(@Param('id') id: string, @Request() req) {
    await this.temarioService.removeItem(id, req.user.id);
    return {
      data: null,
      message: 'Item de temario eliminado exitosamente',
      statusCode: 200,
    };
  }
}
