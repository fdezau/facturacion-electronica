"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getKpis() {
        const ahora = new Date();
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        const inicioAnio = new Date(ahora.getFullYear(), 0, 1);
        const [totalFacturas, totalBoletas, totalClientes, totalProductos, ventasMes, ventasAnio, ultimosComprobantes, comprobantesAnulados,] = await Promise.all([
            this.prisma.comprobante.count({
                where: { tipoComprobante: 'FACTURA', estado: 'EMITIDO' },
            }),
            this.prisma.comprobante.count({
                where: { tipoComprobante: 'BOLETA', estado: 'EMITIDO' },
            }),
            this.prisma.cliente.count(),
            this.prisma.producto.count({ where: { activo: true } }),
            this.prisma.comprobante.aggregate({
                where: { estado: 'EMITIDO', fechaEmision: { gte: inicioMes } },
                _sum: { total: true, igv: true, subtotal: true },
                _count: true,
            }),
            this.prisma.comprobante.aggregate({
                where: { estado: 'EMITIDO', fechaEmision: { gte: inicioAnio } },
                _sum: { total: true },
                _count: true,
            }),
            this.prisma.comprobante.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { cliente: true },
            }),
            this.prisma.comprobante.count({ where: { estado: 'ANULADO' } }),
        ]);
        return {
            resumen: {
                totalFacturas,
                totalBoletas,
                totalClientes,
                totalProductos,
                comprobantesAnulados,
            },
            ventasMes: {
                subtotal: ventasMes._sum.subtotal ?? 0,
                igv: ventasMes._sum.igv ?? 0,
                total: ventasMes._sum.total ?? 0,
                cantidad: ventasMes._count,
            },
            ventasAnio: {
                total: ventasAnio._sum.total ?? 0,
                cantidad: ventasAnio._count,
            },
            ultimosComprobantes: ultimosComprobantes.map((c) => ({
                id: c.id,
                serie: c.serie,
                correlativo: c.correlativo,
                tipo: c.tipoComprobante,
                cliente: c.cliente.razonSocial,
                total: c.total,
                estado: c.estado,
                fecha: c.fechaEmision,
            })),
        };
    }
    async getVentasPorMes() {
        const meses = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return { anio: d.getFullYear(), mes: d.getMonth() + 1 };
        }).reverse();
        const datos = await Promise.all(meses.map(async ({ anio, mes }) => {
            const inicio = new Date(anio, mes - 1, 1);
            const fin = new Date(anio, mes, 0, 23, 59, 59);
            const result = await this.prisma.comprobante.aggregate({
                where: { estado: 'EMITIDO', fechaEmision: { gte: inicio, lte: fin } },
                _sum: { total: true },
                _count: true,
            });
            return {
                mes: inicio.toLocaleString('es-PE', { month: 'short', year: 'numeric' }),
                total: result._sum.total ?? 0,
                cantidad: result._count,
            };
        }));
        return datos;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map