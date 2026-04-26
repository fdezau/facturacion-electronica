import { Controller, Get, UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { JwtGuard } from '../common/guards/jwt.guard'

@UseGuards(JwtGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('kpis')
  getKpis() {
    return this.dashboardService.getKpis()
  }

  @Get('ventas-por-mes')
  getVentasPorMes() {
    return this.dashboardService.getVentasPorMes()
  }
}
