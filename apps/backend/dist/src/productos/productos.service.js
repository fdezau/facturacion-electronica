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
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProductosService = class ProductosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crear(dto) {
        const existe = await this.prisma.producto.findUnique({ where: { codigo: dto.codigo } });
        if (existe)
            throw new common_1.ConflictException('Ya existe un producto con ese código');
        return this.prisma.producto.create({ data: dto });
    }
    async listar(busqueda, soloActivos) {
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
        });
    }
    async obtenerPorId(id) {
        const producto = await this.prisma.producto.findUnique({ where: { id } });
        if (!producto)
            throw new common_1.NotFoundException('Producto no encontrado');
        return producto;
    }
    async actualizar(id, dto) {
        await this.obtenerPorId(id);
        return this.prisma.producto.update({ where: { id }, data: dto });
    }
    async eliminar(id) {
        await this.obtenerPorId(id);
        return this.prisma.producto.delete({ where: { id } });
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductosService);
//# sourceMappingURL=productos.service.js.map