import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKpis() {
    const prisma = this.prisma as any
    const ahora = new Date()
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    const inicioAnio = new Date(ahora.getFullYear(), 0, 1)

    const [totalFacturas, totalBoletas, totalClientes, totalProductos, ventasMes, ventasAnio, ultimosComprobantes, comprobantesAnulados] =
      await Promise.all([
        prisma.comprobante.count({ where: { tipoComprobante: 'FACTURA', estado: 'EMITIDO' } }),
        prisma.comprobante.count({ where: { tipoComprobante: 'BOLETA', estado: 'EMITIDO' } }),
        prisma.cliente.count(),
        prisma.producto.count({ where: { activo: true } }),
        prisma.comprobante.aggregate({
          where: { estado: 'EMITIDO', fechaEmision: { gte: inicioMes } },
          _sum: { total: true, igv: true, subtotal: true },
          _count: true,
        }),
        prisma.comprobante.aggregate({
          where: { estado: 'EMITIDO', fechaEmision: { gte: inicioAnio } },
          _sum: { total: true },
          _count: true,
        }),
        prisma.comprobante.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { cliente: true },
        }),
        prisma.comprobante.count({ where: { estado: 'ANULADO' } }),
      ])

    return {
      resumen: { totalFacturas, totalBoletas, totalClientes, totalProductos, comprobantesAnulados },
      ventasMes: {
        subtotal: ventasMes._sum.subtotal ?? 0,
        igv: ventasMes._sum.igv ?? 0,
        total: ventasMes._sum.total ?? 0,
        cantidad: ventasMes._count,
      },
      ventasAnio: { total: ventasAnio._sum.total ?? 0, cantidad: ventasAnio._count },
      ultimosComprobantes: ultimosComprobantes.map((c: any) => ({
        id: c.id, serie: c.serie, correlativo: c.correlativo,
        tipo: c.tipoComprobante, cliente: c.cliente.razonSocial,
        total: c.total, estado: c.estado, fecha: c.fechaEmision,
      })),
    }
  }

  async getVentasPorMes() {
    const prisma = this.prisma as any
    const meses = Array.from({ length: 6 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      return { anio: d.getFullYear(), mes: d.getMonth() + 1 }
    }).reverse()

    return Promise.all(
      meses.map(async ({ anio, mes }) => {
        const inicio = new Date(anio, mes - 1, 1)
        const fin = new Date(anio, mes, 0, 23, 59, 59)
        const result = await prisma.comprobante.aggregate({
          where: { estado: 'EMITIDO', fechaEmision: { gte: inicio, lte: fin } },
          _sum: { total: true },
          _count: true,
        })
        return {
          mes: inicio.toLocaleString('es-PE', { month: 'short', year: 'numeric' }),
          total: result._sum.total ?? 0,
          cantidad: result._count,
        }
      }),
    )
  }
}
