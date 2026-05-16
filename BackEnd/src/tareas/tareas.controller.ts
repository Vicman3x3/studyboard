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
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('tareas')
@UseGuards(JwtAuthGuard)
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  create(@Request() req, @Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.create(req.user.userId, createTareaDto);
  }

  @Get()
  findAll(@Request() req, @Query('materia_id') materiaId?: string) {
    return this.tareasService.findAll(req.user.userId, materiaId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.tareasService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTareaDto: UpdateTareaDto,
  ) {
    return this.tareasService.update(id, req.user.userId, updateTareaDto);
  }

  @Patch(':id/estado')
  updateEstado(
    @Request() req,
    @Param('id') id: string,
    @Body() updateEstadoDto: UpdateEstadoDto,
  ) {
    return this.tareasService.updateEstado(
      id,
      req.user.userId,
      updateEstadoDto,
    );
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.tareasService.remove(id, req.user.userId);
  }
}
