import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CreateComprobanteDto } from './dto/create-comprobante.dto'
import { TipoComprobante, EstadoComprobante } from '../common/enums'

const IGV_RATE = 0.18

@Injectable()
export class ComprobantesService {
  constructor(private prisma: PrismaService) {}

  private async generarSerie(tipo: TipoComprobante): Promise<{ serie: string; correlativo: string }> {
    const prefijos = {
      FACTURA: 'F001',
      BOLETA: 'B001',
      NOTA_CREDITO: 'FC01',
      NOTA_DEBITO: 'FD01',
    }
    const serie = prefijos[tipo]
    const ultimo = await (this.prisma as any).comprobante.findFirst({
      where: { serie, tipoComprobante: tipo },
      orderBy: { correlativo: 'desc' },
    })
    const siguiente = ultimo ? parseInt(ultimo.correlativo) + 1 : 1
    return { serie, correlativo: String(siguiente).padStart(8, '0') }
  }

  private calcularTotales(items: CreateComprobanteDto['items']) {
    return items.map((item) => {
      const descuento = item.descuento ?? 0
      const afectaIgv = item.afectaIgv ?? true
      const subtotalItem = item.cantidad * item.precioUnitario - descuento
      const igvItem = afectaIgv ? subtotalItem * IGV_RATE : 0
      const totalItem = subtotalItem + igvItem
      return {
        descripcion: item.descripcion,
        productoId: item.productoId ?? null,
        cantidad: item.cantidad,
        unidad: item.unidad ?? 'NIU',
        precioUnitario: item.precioUnitario,
        descuento,
        subtotal: subtotalItem,
        igv: igvItem,
        total: totalItem,
        afectaIgv,
      }
    })
  }

  async crear(dto: CreateComprobanteDto) {
    const prisma = this.prisma as any
    const cliente = await prisma.cliente.findUnique({ where: { id: dto.clienteId } })
    if (!cliente) throw new NotFoundException('Cliente no encontrado')

    const empresa = await prisma.empresa.findUnique({ where: { id: dto.empresaId } })
    if (!empresa) throw new NotFoundException('Empresa no encontrada')

    if (dto.tipoComprobante === 'FACTURA' && cliente.tipoDoc !== 'RUC')
      throw new BadRequestException('Las facturas solo se emiten a clientes con RUC')

    const itemsCalculados = this.calcularTotales(dto.items)
    const subtotal = itemsCalculados.reduce((a, i) => a + i.subtotal, 0)
    const igv = itemsCalculados.reduce((a, i) => a + i.igv, 0)
    const total = itemsCalculados.reduce((a, i) => a + i.total, 0)
    const { serie, correlativo } = await this.generarSerie(dto.tipoComprobante)

    return prisma.comprobante.create({
      data: {
        serie, correlativo,
        tipoComprobante: dto.tipoComprobante,
        clienteId: dto.clienteId,
        empresaId: dto.empresaId,
        moneda: dto.moneda ?? 'PEN',
        observaciones: dto.observaciones,
        fechaVencimiento: dto.fechaVencimiento ? new Date(dto.fechaVencimiento) : null,
        subtotal, igv, total,
        items: { create: itemsCalculados },
      },
      include: { items: true, cliente: true, empresa: true },
    })
  }

  async listar(filtros?: { tipo?: TipoComprobante; estado?: EstadoComprobante; clienteId?: string }) {
    return (this.prisma as any).comprobante.findMany({
      where: {
        tipoComprobante: filtros?.tipo,
        estado: filtros?.estado,
        clienteId: filtros?.clienteId,
      },
      include: { cliente: true, empresa: true, items: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async obtenerPorId(id: string) {
    const comprobante = await (this.prisma as any).comprobante.findUnique({
      where: { id },
      include: { cliente: true, empresa: true, items: { include: { producto: true } } },
    })
    if (!comprobante) throw new NotFoundException('Comprobante no encontrado')
    return comprobante
  }

  async anular(id: string) {
    const comprobante = await this.obtenerPorId(id)
    if (comprobante.estado === 'ANULADO')
      throw new BadRequestException('El comprobante ya está anulado')
    return (this.prisma as any).comprobante.update({
      where: { id },
      data: { estado: EstadoComprobante.ANULADO },
    })
  }

  async estadisticas() {
    const prisma = this.prisma as any
    const [facturas, boletas, totalMes, comprobantesAnulados] = await Promise.all([
      prisma.comprobante.count({ where: { tipoComprobante: 'FACTURA', estado: 'EMITIDO' } }),
      prisma.comprobante.count({ where: { tipoComprobante: 'BOLETA', estado: 'EMITIDO' } }),
      prisma.comprobante.aggregate({
        where: {
          estado: 'EMITIDO',
          fechaEmision: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
        _sum: { total: true, igv: true },
      }),
      prisma.comprobante.count({ where: { estado: 'ANULADO' } }),
    ])
    return {
      facturas, boletas,
      totalMes: totalMes._sum.total ?? 0,
      igvMes: totalMes._sum.igv ?? 0,
      comprobantesAnulados,
    }
  }
}
