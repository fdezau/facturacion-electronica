import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ClientesService } from './clientes.service'
import { CreateClienteDto } from './dto/create-cliente.dto'
import { UpdateClienteDto } from './dto/update-cliente.dto'
import { JwtGuard } from '../common/guards/jwt.guard'

@UseGuards(JwtGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @Get('autocompletar')
  autocompletar(@Query('tipoDoc') tipoDoc: string, @Query('numDoc') numDoc: string) {
    return this.clientesService.autocompletar(tipoDoc, numDoc)
  }

  @Get('consultar/ruc/:ruc')
  consultarRuc(@Param('ruc') ruc: string) {
    return this.clientesService.consultarRuc(ruc)
  }

  @Get('consultar/dni/:dni')
  consultarDni(@Param('dni') dni: string) {
    return this.clientesService.consultarDni(dni)
  }

  @Post()
  crear(@Body() dto: CreateClienteDto) {
    return this.clientesService.crear(dto)
  }

  @Get()
  listar(@Query('busqueda') busqueda?: string) {
    return this.clientesService.listar(busqueda)
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.clientesService.obtenerPorId(id)
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.clientesService.actualizar(id, dto)
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.clientesService.eliminar(id)
  }
}
