import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento, TipoReferencia } from './documento.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentosService {
  private readonly uploadsPath = './uploads';

  constructor(
    @InjectRepository(Documento)
    private readonly documentoRepo: Repository<Documento>,
  ) {
    // Crear carpeta uploads si no existe
    if (!fs.existsSync(this.uploadsPath)) {
      fs.mkdirSync(this.uploadsPath, { recursive: true });
    }
  }

  async upload(
    file: Express.Multer.File,
    tipoReferencia: TipoReferencia,
    referenciaId: string,
    usuarioId: string,
  ) {
    // Generar nombre único
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const nombreArchivo = `${timestamp}_${Math.random().toString(36).substring(7)}${extension}`;
    const rutaArchivo = path.join(this.uploadsPath, nombreArchivo);

    // Guardar archivo en disco
    fs.writeFileSync(rutaArchivo, file.buffer);

    // Crear registro en BD
    const documento = this.documentoRepo.create({
      nombre: nombreArchivo,
      nombreOriginal: file.originalname,
      url: `/uploads/${nombreArchivo}`,
      tipo: file.mimetype,
      tamano: file.size,
      tipoReferencia,
      referenciaId,
      usuarioId,
    });

    return this.documentoRepo.save(documento);
  }

  async findAll(usuarioId: string) {
    return this.documentoRepo.find({
      where: { usuarioId },
      order: { fechaSubida: 'DESC' },
    });
  }

  async findByReferencia(
    tipoReferencia: TipoReferencia,
    referenciaId: string,
    usuarioId: string,
  ) {
    return this.documentoRepo.find({
      where: { tipoReferencia, referenciaId, usuarioId },
      order: { fechaSubida: 'DESC' },
    });
  }

  async findOne(id: string, usuarioId: string) {
    const documento = await this.documentoRepo.findOne({
      where: { id, usuarioId },
    });

    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    return documento;
  }

  async delete(id: string, usuarioId: string) {
    const documento = await this.findOne(id, usuarioId);

    // Eliminar archivo físico
    const rutaArchivo = path.join(this.uploadsPath, documento.nombre);
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }

    // Eliminar registro de BD
    await this.documentoRepo.remove(documento);

    return { message: 'Documento eliminado exitosamente' };
  }

  getFilePath(nombreArchivo: string): string {
    return path.join(this.uploadsPath, nombreArchivo);
  }
}
