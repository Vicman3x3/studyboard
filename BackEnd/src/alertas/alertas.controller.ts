import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/alertas')
@UseGuards(JwtAuthGuard)
export class AlertasController {
  constructor(private readonly alertasService: AlertasService) {}

  @Get()
  async getAlertas(@Request() req) {
    const alertas = await this.alertasService.getAlertas(req.user.id);
    return {
      data: alertas,
      message: 'Alertas obtenidas exitosamente',
      statusCode: 200,
    };
  }

  @Get('contar-no-leidas')
  async contarNoLeidas(@Request() req) {
    const count = await this.alertasService.contarNoLeidas(req.user.id);
    return {
      data: { count },
      message: 'Conteo obtenido exitosamente',
      statusCode: 200,
    };
  }

  @Post('marcar-leida/:id')
  async marcarLeida(@Param('id') id: string, @Request() req) {
    const alerta = await this.alertasService.marcarLeida(id, req.user.id);
    return {
      data: alerta,
      message: 'Alerta marcada como leída',
      statusCode: 200,
    };
  }
}
