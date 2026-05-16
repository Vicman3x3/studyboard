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
} from '@nestjs/common';
import { MateriasService } from './materias.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('materias')
@UseGuards(JwtAuthGuard)
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Post()
  create(@Request() req, @Body() createMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(req.user.userId, createMateriaDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.materiasService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.materiasService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateMateriaDto: UpdateMateriaDto,
  ) {
    return this.materiasService.update(id, req.user.userId, updateMateriaDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.materiasService.remove(id, req.user.userId);
  }
}
