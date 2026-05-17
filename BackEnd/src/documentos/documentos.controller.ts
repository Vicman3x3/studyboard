import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Body,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocumentosService } from './documentos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TipoReferencia } from './documento.entity';
import * as fs from 'fs';

@Controller('api/documentos')
@UseGuards(JwtAuthGuard)
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('tipoReferencia') tipoReferencia: TipoReferencia,
    @Body('referenciaId') referenciaId: string,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const documento = await this.documentosService.upload(
      file,
      tipoReferencia,
      referenciaId,
      req.user.id,
    );

    return {
      data: documento,
      message: 'Archivo subido exitosamente',
      statusCode: 201,
    };
  }

  @Get()
  async findAll(@Request() req) {
    const documentos = await this.documentosService.findAll(req.user.id);
    return {
      data: documentos,
      message: 'Documentos obtenidos exitosamente',
      statusCode: 200,
    };
  }

  @Get('referencia')
  async findByReferencia(
    @Query('tipo') tipoReferencia: TipoReferencia,
    @Query('id') referenciaId: string,
    @Request() req,
  ) {
    const documentos = await this.documentosService.findByReferencia(
      tipoReferencia,
      referenciaId,
      req.user.id,
    );
    return {
      data: documentos,
      message: 'Documentos obtenidos exitosamente',
      statusCode: 200,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const documento = await this.documentosService.findOne(id, req.user.id);
    return {
      data: documento,
      message: 'Documento obtenido exitosamente',
      statusCode: 200,
    };
  }

  @Get('download/:id')
  async download(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const documento = await this.documentosService.findOne(id, req.user.id);
    const filePath = this.documentosService.getFilePath(documento.nombre);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Archivo no encontrado en el sistema');
    }

    res.setHeader('Content-Type', documento.tipo);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${documento.nombreOriginal}"`,
    );
    res.sendFile(filePath, { root: '.' });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const result = await this.documentosService.delete(id, req.user.id);
    return {
      data: result,
      message: 'Documento eliminado exitosamente',
      statusCode: 200,
    };
  }
}
