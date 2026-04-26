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
exports.ComprobantesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const IGV_RATE = 0.18;
let ComprobantesService = class ComprobantesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generarSerie(tipo) {
        const prefijos = {
            FACTURA: 'F001',
            BOLETA: 'B001',
            NOTA_CREDITO: 'FC01',
            NOTA_DEBITO: 'FD01',
        };
        const serie = prefijos[tipo];
        const ultimo = await this.prisma.comprobante.findFirst({
            where: { serie, tipoComprobante: tipo },
            orderBy: { correlativo: 'desc' },
        });
        const siguiente = ultimo ? parseInt(ultimo.correlativo) + 1 : 1;
        return { serie, correlativo: String(siguiente).padStart(8, '0') };
    }
    calcularTotales(items) {
        return items.map((item) => {
            const descuento = item.descuento ?? 0;
            const afectaIgv = item.afectaIgv ?? true;
            const subtotalItem = item.cantidad * item.precioUnitario - descuento;
            const igvItem = afectaIgv ? subtotalItem * IGV_RATE : 0;
            const totalItem = subtotalItem + igvItem;
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
            };
        });
    }
    async crear(dto) {
        const cliente = await this.prisma.cliente.findUnique({ where: { id: dto.clienteId } });
        if (!cliente)
            throw new common_1.NotFoundException('Cliente no encontrado');
        const empresa = await this.prisma.empresa.findUnique({ where: { id: dto.empresaId } });
        if (!empresa)
            throw new common_1.NotFoundException('Empresa no encontrada');
        if (dto.tipoComprobante === 'FACTURA' && cliente.tipoDoc !== 'RUC')
            throw new common_1.BadRequestException('Las facturas solo se emiten a clientes con RUC');
        const itemsCalculados = this.calcularTotales(dto.items);
        const subtotal = itemsCalculados.reduce((a, i) => a + i.subtotal, 0);
        const igv = itemsCalculados.reduce((a, i) => a + i.igv, 0);
        const total = itemsCalculados.reduce((a, i) => a + i.total, 0);
        const { serie, correlativo } = await this.generarSerie(dto.tipoComprobante);
        return this.prisma.comprobante.create({
            data: {
                serie,
                correlativo,
                tipoComprobante: dto.tipoComprobante,
                clienteId: dto.clienteId,
                empresaId: dto.empresaId,
                moneda: dto.moneda ?? 'PEN',
                observaciones: dto.observaciones,
                fechaVencimiento: dto.fechaVencimiento ? new Date(dto.fechaVencimiento) : null,
                subtotal,
                igv,
                total,
                items: { create: itemsCalculados },
            },
            include: { items: true, cliente: true, empresa: true },
        });
    }
    async listar(filtros) {
        return this.prisma.comprobante.findMany({
            where: {
                tipoComprobante: filtros?.tipo,
                estado: filtros?.estado,
                clienteId: filtros?.clienteId,
            },
            include: { cliente: true, empresa: true, items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async obtenerPorId(id) {
        const comprobante = await this.prisma.comprobante.findUnique({
            where: { id },
            include: { cliente: true, empresa: true, items: { include: { producto: true } } },
        });
        if (!comprobante)
            throw new common_1.NotFoundException('Comprobante no encontrado');
        return comprobante;
    }
    async anular(id) {
        const comprobante = await this.obtenerPorId(id);
        if (comprobante.estado === 'ANULADO')
            throw new common_1.BadRequestException('El comprobante ya está anulado');
        return this.prisma.comprobante.update({
            where: { id },
            data: { estado: client_1.EstadoComprobante.ANULADO },
        });
    }
    async estadisticas() {
        const [facturas, boletas, totalMes] = await Promise.all([
            this.prisma.comprobante.count({ where: { tipoComprobante: 'FACTURA', estado: 'EMITIDO' } }),
            this.prisma.comprobante.count({ where: { tipoComprobante: 'BOLETA', estado: 'EMITIDO' } }),
            this.prisma.comprobante.aggregate({
                where: {
                    estado: 'EMITIDO',
                    fechaEmision: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
                _sum: { total: true, igv: true },
            }),
        ]);
        return {
            facturas,
            boletas,
            totalMes: totalMes._sum.total ?? 0,
            igvMes: totalMes._sum.igv ?? 0,
        };
    }
};
exports.ComprobantesService = ComprobantesService;
exports.ComprobantesService = ComprobantesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComprobantesService);
//# sourceMappingURL=comprobantes.service.js.map