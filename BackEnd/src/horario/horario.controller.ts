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
import { HorarioService } from './horario.service';
import { CreateBloqueDto } from './dto/create-bloque.dto';
import { UpdateBloqueDto } from './dto/update-bloque.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/horario')
@UseGuards(JwtAuthGuard)
export class HorarioController {
  constructor(private readonly horarioService: HorarioService) {}

  @Get()
  async findAll(@Request() req, @Query('materia_id') materiaId?: string) {
    const bloques = await this.horarioService.findAll(req.user.id, materiaId);
    return {
      data: bloques,
      message: 'Bloques de horario obtenidos exitosamente',
      statusCode: 200,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const bloque = await this.horarioService.findOne(id, req.user.id);
    return {
      data: bloque,
      message: 'Bloque de horario obtenido exitosamente',
      statusCode: 200,
    };
  }

  @Post()
  async create(@Body() createBloqueDto: CreateBloqueDto, @Request() req) {
    const bloque = await this.horarioService.create(createBloqueDto, req.user.id);
    return {
      data: bloque,
      message: 'Bloque de horario creado exitosamente',
      statusCode: 201,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBloqueDto: UpdateBloqueDto,
    @Request() req,
  ) {
    const bloque = await this.horarioService.update(id, updateBloqueDto, req.user.id);
    return {
      data: bloque,
      message: 'Bloque de horario actualizado exitosamente',
      statusCode: 200,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.horarioService.remove(id, req.user.id);
    return {
      data: null,
      message: 'Bloque de horario eliminado exitosamente',
      statusCode: 200,
    };
  }
}
