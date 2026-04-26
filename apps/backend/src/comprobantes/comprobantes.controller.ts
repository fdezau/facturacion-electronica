import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Res } from '@nestjs/common'
import { Response } from 'express'
import { ComprobantesService } from './comprobantes.service'
import { PdfService } from '../pdf/pdf.service'
import { CreateComprobanteDto } from './dto/create-comprobante.dto'
import { JwtGuard } from '../common/guards/jwt.guard'
import { TipoComprobante, EstadoComprobante } from '../common/enums'

@UseGuards(JwtGuard)
@Controller('comprobantes')
export class ComprobantesController {
  constructor(
    private comprobantesService: ComprobantesService,
    private pdfService: PdfService,
  ) {}

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

  @Get(':id/pdf')
  async descargarPdf(@Param('id') id: string, @Res() res: Response) {
    const comprobante = await this.comprobantesService.obtenerPorId(id)
    const buffer = await this.pdfService.generarComprobante(comprobante)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${comprobante.serie}-${comprobante.correlativo}.pdf"`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Patch(':id/anular')
  anular(@Param('id') id: string) {
    return this.comprobantesService.anular(id)
  }
}
