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
exports.EmpresaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let EmpresaService = class EmpresaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crear(dto) {
        const existe = await this.prisma.empresa.findUnique({ where: { ruc: dto.ruc } });
        if (existe)
            throw new common_1.ConflictException('Ya existe una empresa con ese RUC');
        return this.prisma.empresa.create({ data: dto });
    }
    async obtener() {
        const empresas = await this.prisma.empresa.findMany({ orderBy: { createdAt: 'desc' } });
        if (!empresas.length)
            throw new common_1.NotFoundException('No hay empresas registradas');
        return empresas;
    }
    async obtenerPrincipal() {
        const empresa = await this.prisma.empresa.findFirst({ orderBy: { createdAt: 'asc' } });
        if (!empresa)
            throw new common_1.NotFoundException('No hay empresa configurada');
        return empresa;
    }
    async obtenerPorId(id) {
        const empresa = await this.prisma.empresa.findUnique({ where: { id } });
        if (!empresa)
            throw new common_1.NotFoundException('Empresa no encontrada');
        return empresa;
    }
    async actualizar(id, dto) {
        await this.obtenerPorId(id);
        return this.prisma.empresa.update({ where: { id }, data: dto });
    }
    async eliminar(id) {
        await this.obtenerPorId(id);
        return this.prisma.empresa.delete({ where: { id } });
    }
};
exports.EmpresaService = EmpresaService;
exports.EmpresaService = EmpresaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmpresaService);
//# sourceMappingURL=empresa.service.js.map