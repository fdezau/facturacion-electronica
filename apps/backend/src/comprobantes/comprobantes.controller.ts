import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ComprobantesService } from './comprobantes.service'
import { CreateComprobanteDto } from './dto/create-comprobante.dto'
import { JwtGuard } from '../common/guards/jwt.guard'
import { TipoComprobante, EstadoComprobante } from '@prisma/client'

@UseGuards(JwtGuard)
@Controller('comprobantes')
export class ComprobantesController {
  constructor(private comprobantesService: ComprobantesService) {}

  @Post()
  crear(@Body() dto: CreateComprobanteDto) {
    return this.comprobantesService.crear(dto)
  }

  @Get()
  listar(
    @Query('tipo') tipo?: TipoComprobante,
    @Query('estado') estado?: EstadoComprobante,
    @Query('clienteId') clienteId?: string,
  ) {
    return this.comprobantesService.listar({ tipo, estado, clienteId })
  }

  @Get('estadisticas')
  estadisticas() {
    return this.comprobantesService.estadisticas()
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.comprobantesService.obtenerPorId(id)
  }

  @Patch(':id/anular')
  anular(@Param('id') id: string) {
    return this.comprobantesService.anular(id)
  }
}
