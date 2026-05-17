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
import { CalificacionesService } from './calificaciones.service';
import { CreateCriterioDto } from './dto/create-criterio.dto';
import { UpdateCriterioDto } from './dto/update-criterio.dto';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/calificaciones')
@UseGuards(JwtAuthGuard)
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  // === CRITERIOS ===

  @Get('criterios')
  async findAllCriterios(@Request() req, @Query('materia_id') materiaId?: string) {
    const criterios = await this.calificacionesService.findAllCriterios(req.user.id, materiaId);
    return {
      data: criterios,
      message: 'Criterios obtenidos exitosamente',
      statusCode: 200,
    };
  }

  @Get('criterios/:id')
  async findOneCriterio(@Param('id') id: string, @Request() req) {
    const criterio = await this.calificacionesService.findOneCriterio(id, req.user.id);
    return {
      data: criterio,
      message: 'Criterio obtenido exitosamente',
      statusCode: 200,
    };
  }

  @Post('criterios')
  async createCriterio(@Body() createCriterioDto: CreateCriterioDto, @Request() req) {
    const criterio = await this.calificacionesService.createCriterio(createCriterioDto, req.user.id);
    return {
      data: criterio,
      message: 'Criterio creado exitosamente',
      statusCode: 201,
    };
  }

  @Patch('criterios/:id')
  async updateCriterio(
    @Param('id') id: string,
    @Body() updateCriterioDto: UpdateCriterioDto,
    @Request() req,
  ) {
    const criterio = await this.calificacionesService.updateCriterio(
      id,
      updateCriterioDto,
      req.user.id,
    );
    return {
      data: criterio,
      message: 'Criterio actualizado exitosamente',
      statusCode: 200,
    };
  }

  @Delete('criterios/:id')
  async removeCriterio(@Param('id') id: string, @Request() req) {
    await this.calificacionesService.removeCriterio(id, req.user.id);
    return {
      data: null,
      message: 'Criterio eliminado exitosamente',
      statusCode: 200,
    };
  }

  // === CALIFICACIONES ===

  @Get()
  async findAllCalificaciones(
    @Request() req,
    @Query('materia_id') materiaId?: string,
    @Query('parcial_id') parcialId?: string,
  ) {
    const calificaciones = await this.calificacionesService.findAllCalificaciones(
      req.user.id,
      materiaId,
      parcialId,
    );
    return {
      data: calificaciones,
      message: 'Calificaciones obtenidas exitosamente',
      statusCode: 200,
    };
  }

  @Get(':id')
  async findOneCalificacion(@Param('id') id: string, @Request() req) {
    const calificacion = await this.calificacionesService.findOneCalificacion(id, req.user.id);
    return {
      data: calificacion,
      message: 'Calificación obtenida exitosamente',
      statusCode: 200,
    };
  }

  @Post()
  async createCalificacion(@Body() createCalificacionDto: CreateCalificacionDto, @Request() req) {
    const calificacion = await this.calificacionesService.createCalificacion(
      createCalificacionDto,
      req.user.id,
    );
    return {
      data: calificacion,
      message: 'Calificación creada exitosamente',
      statusCode: 201,
    };
  }

  @Patch(':id')
  async updateCalificacion(
    @Param('id') id: string,
    @Body() updateCalificacionDto: UpdateCalificacionDto,
    @Request() req,
  ) {
    const calificacion = await this.calificacionesService.updateCalificacion(
      id,
      updateCalificacionDto,
      req.user.id,
    );
    return {
      data: calificacion,
      message: 'Calificación actualizada exitosamente',
      statusCode: 200,
    };
  }

  @Delete(':id')
  async removeCalificacion(@Param('id') id: string, @Request() req) {
    await this.calificacionesService.removeCalificacion(id, req.user.id);
    return {
      data: null,
      message: 'Calificación eliminada exitosamente',
      statusCode: 200,
    };
  }

  // === CÁLCULOS ===

  @Get('promedio/:materiaId')
  async calcularPromedio(@Param('materiaId') materiaId: string, @Request() req) {
    const promedio = await this.calificacionesService.calcularPromedio(materiaId, req.user.id);
    return {
      data: { promedio },
      message: 'Promedio calculado exitosamente',
      statusCode: 200,
    };
  }

  @Get('proyeccion/:materiaId')
  async calcularProyeccion(
    @Param('materiaId') materiaId: string,
    @Request() req,
    @Query('nota_deseada') notaDeseada?: number,
  ) {
    const proyeccion = await this.calificacionesService.calcularProyeccion(
      materiaId,
      req.user.id,
      notaDeseada || 70,
    );
    return {
      data: proyeccion,
      message: 'Proyección calculada exitosamente',
      statusCode: 200,
    };
  }
}
