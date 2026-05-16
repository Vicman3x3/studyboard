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
import { SemestresService } from './semestres.service';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('semestres')
@UseGuards(JwtAuthGuard)
export class SemestresController {
  constructor(private readonly semestresService: SemestresService) {}

  @Post()
  create(@Request() req, @Body() createSemestreDto: CreateSemestreDto) {
    return this.semestresService.create(req.user.userId, createSemestreDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.semestresService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.semestresService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSemestreDto: UpdateSemestreDto,
  ) {
    return this.semestresService.update(
      id,
      req.user.userId,
      updateSemestreDto,
    );
  }

  @Patch(':id/activar')
  activar(@Request() req, @Param('id') id: string) {
    return this.semestresService.activar(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.semestresService.remove(id, req.user.userId);
  }
}
