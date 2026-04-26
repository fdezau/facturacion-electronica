import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { EmpresaService } from './empresa.service'
import { CreateEmpresaDto } from './dto/create-empresa.dto'
import { UpdateEmpresaDto } from './dto/update-empresa.dto'
import { JwtGuard } from '../common/guards/jwt.guard'

@UseGuards(JwtGuard)
@Controller('empresa')
export class EmpresaController {
  constructor(private empresaService: EmpresaService) {}

  @Post()
  crear(@Body() dto: CreateEmpresaDto) {
    return this.empresaService.crear(dto)
  }

  @Get()
  obtener() {
    return this.empresaService.obtener()
  }

  @Get('principal')
  obtenerPrincipal() {
    return this.empresaService.obtenerPrincipal()
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.empresaService.obtenerPorId(id)
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: UpdateEmpresaDto) {
    return this.empresaService.actualizar(id, dto)
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.empresaService.eliminar(id)
  }
}
