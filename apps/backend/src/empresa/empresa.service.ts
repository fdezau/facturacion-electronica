import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CreateEmpresaDto } from './dto/create-empresa.dto'
import { UpdateEmpresaDto } from './dto/update-empresa.dto'

@Injectable()
export class EmpresaService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CreateEmpresaDto) {
    const existe = await this.prisma.empresa.findUnique({ where: { ruc: dto.ruc } })
    if (existe) throw new ConflictException('Ya existe una empresa con ese RUC')
    return this.prisma.empresa.create({ data: dto })
  }

  async obtener() {
    const empresas = await this.prisma.empresa.findMany({ orderBy: { createdAt: 'desc' } })
    if (!empresas.length) throw new NotFoundException('No hay empresas registradas')
    return empresas
  }

  async obtenerPrincipal() {
    const empresa = await this.prisma.empresa.findFirst({ orderBy: { createdAt: 'asc' } })
    if (!empresa) throw new NotFoundException('No hay empresa configurada')
    return empresa
  }

  async obtenerPorId(id: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } })
    if (!empresa) throw new NotFoundException('Empresa no encontrada')
    return empresa
  }

  async actualizar(id: string, dto: UpdateEmpresaDto) {
    await this.obtenerPorId(id)
    return this.prisma.empresa.update({ where: { id }, data: dto })
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id)
    return this.prisma.empresa.delete({ where: { id } })
  }
}
