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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const axios_1 = __importDefault(require("axios"));
let ClientesService = class ClientesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async consultarRuc(ruc) {
        try {
            const { data } = await axios_1.default.get(`https://api.apis.net.pe/v2/sunat/ruc?numero=${ruc}`, {
                headers: { Authorization: `Bearer ${process.env.APIS_NET_PE_TOKEN ?? 'apis-token-demo'}` },
                timeout: 5000,
            });
            return data;
        }
        catch {
            return null;
        }
    }
    async consultarDni(dni) {
        try {
            const { data } = await axios_1.default.get(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
                headers: { Authorization: `Bearer ${process.env.APIS_NET_PE_TOKEN ?? 'apis-token-demo'}` },
                timeout: 5000,
            });
            return data;
        }
        catch {
            return null;
        }
    }
    async autocompletar(tipoDoc, numDoc) {
        if (tipoDoc === 'RUC') {
            if (numDoc.length !== 11)
                throw new common_1.BadRequestException('RUC debe tener 11 dígitos');
            const data = await this.consultarRuc(numDoc);
            if (!data)
                throw new common_1.NotFoundException('RUC no encontrado');
            return {
                razonSocial: data.razonSocial,
                direccion: data.direccion ?? '',
                tipoDoc: 'RUC',
                numDoc,
            };
        }
        if (tipoDoc === 'DNI') {
            if (numDoc.length !== 8)
                throw new common_1.BadRequestException('DNI debe tener 8 dígitos');
            const data = await this.consultarDni(numDoc);
            if (!data)
                throw new common_1.NotFoundException('DNI no encontrado');
            return {
                razonSocial: `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
                direccion: '',
                tipoDoc: 'DNI',
                numDoc,
            };
        }
        throw new common_1.BadRequestException('Tipo de documento no soportado para autocompletar');
    }
    async crear(dto) {
        const existe = await this.prisma.cliente.findUnique({ where: { numDoc: dto.numDoc } });
        if (existe)
            throw new common_1.ConflictException('Ya existe un cliente con ese documento');
        return this.prisma.cliente.create({ data: dto });
    }
    async listar(busqueda) {
        return this.prisma.cliente.findMany({
            where: busqueda
                ? {
                    OR: [
                        { razonSocial: { contains: busqueda, mode: 'insensitive' } },
                        { numDoc: { contains: busqueda } },
                    ],
                }
                : undefined,
            orderBy: { razonSocial: 'asc' },
        });
    }
    async obtenerPorId(id) {
        const cliente = await this.prisma.cliente.findUnique({ where: { id } });
        if (!cliente)
            throw new common_1.NotFoundException('Cliente no encontrado');
        return cliente;
    }
    async actualizar(id, dto) {
        await this.obtenerPorId(id);
        return this.prisma.cliente.update({ where: { id }, data: dto });
    }
    async eliminar(id) {
        await this.obtenerPorId(id);
        return this.prisma.cliente.delete({ where: { id } });
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map