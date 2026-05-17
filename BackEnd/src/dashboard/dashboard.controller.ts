import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumen')
  async getResumen(@Request() req) {
    const resumen = await this.dashboardService.getResumen(req.user.id);
    return {
      data: resumen,
      message: 'Resumen obtenido exitosamente',
      statusCode: 200,
    };
  }

  @Get('proximas-entregas')
  async getProximasEntregas(@Request() req) {
    const tareas = await this.dashboardService.getProximasEntregas(req.user.id);
    return {
      data: tareas,
      message: 'Próximas entregas obtenidas exitosamente',
      statusCode: 200,
    };
  }
}
