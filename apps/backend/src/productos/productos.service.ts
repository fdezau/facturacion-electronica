import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CreateProductoDto) {
    const existe = await this.prisma.producto.findUnique({ where: { codigo: dto.codigo } })
    if (existe) throw new ConflictException('Ya existe un producto con ese código')
    return this.prisma.producto.create({ data: dto })
  }

  async listar(busqueda?: string, soloActivos?: boolean) {
    return this.prisma.producto.findMany({
      where: {
        activo: soloActivos ? true : undefined,
        OR: busqueda
          ? [
              { descripcion: { contains: busqueda, mode: 'insensitive' } },
              { codigo: { contains: busqueda, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: { descripcion: 'asc' },
    })
  }

  async obtenerPorId(id: string) {
    const producto = await this.prisma.producto.findUnique({ where: { id } })
    if (!producto) throw new NotFoundException('Producto no encontrado')
    return producto
  }

  async actualizar(id: string, dto: UpdateProductoDto) {
    await this.obtenerPorId(id)
    return this.prisma.producto.update({ where: { id }, data: dto })
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id)
    return this.prisma.producto.delete({ where: { id } })
  }
}
