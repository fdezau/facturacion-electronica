import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ProductosService } from './productos.service'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'
import { JwtGuard } from '../common/guards/jwt.guard'

@UseGuards(JwtGuard)
@Controller('productos')
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  @Post()
  crear(@Body() dto: CreateProductoDto) {
    return this.productosService.crear(dto)
  }

  @Get()
  listar(
    @Query('busqueda') busqueda?: string,
    @Query('soloActivos') soloActivos?: string,
  ) {
    return this.productosService.listar(busqueda, soloActivos === 'true')
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.productosService.obtenerPorId(id)
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    return this.productosService.actualizar(id, dto)
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.productosService.eliminar(id)
  }
}
