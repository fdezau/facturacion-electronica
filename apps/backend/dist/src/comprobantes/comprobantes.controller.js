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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprobantesController = void 0;
const common_1 = require("@nestjs/common");
const comprobantes_service_1 = require("./comprobantes.service");
const pdf_service_1 = require("../pdf/pdf.service");
const create_comprobante_dto_1 = require("./dto/create-comprobante.dto");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const enums_1 = require("../common/enums");
let ComprobantesController = class ComprobantesController {
    constructor(comprobantesService, pdfService) {
        this.comprobantesService = comprobantesService;
        this.pdfService = pdfService;
    }
    crear(dto) {
        return this.comprobantesService.crear(dto);
    }
    listar(tipo, estado, clienteId) {
        return this.comprobantesService.listar({ tipo, estado, clienteId });
    }
    estadisticas() {
        return this.comprobantesService.estadisticas();
    }
    obtenerPorId(id) {
        return this.comprobantesService.obtenerPorId(id);
    }
    async descargarPdf(id, res) {
        const comprobante = await this.comprobantesService.obtenerPorId(id);
        const buffer = await this.pdfService.generarComprobante(comprobante);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${comprobante.serie}-${comprobante.correlativo}.pdf"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    anular(id) {
        return this.comprobantesService.anular(id);
    }
};
exports.ComprobantesController = ComprobantesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comprobante_dto_1.CreateComprobanteDto]),
    __metadata("design:returntype", void 0)
], ComprobantesController.prototype, "crear", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('tipo')),
    __param(1, (0, common_1.Query)('estado')),
    __param(2, (0, common_1.Query)('clienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ComprobantesController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComprobantesController.prototype, "estadisticas", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComprobantesController.prototype, "obtenerPorId", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComprobantesController.prototype, "descargarPdf", null);
__decorate([
    (0, common_1.Patch)(':id/anular'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComprobantesController.prototype, "anular", null);
exports.ComprobantesController = ComprobantesController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('comprobantes'),
    __metadata("design:paramtypes", [comprobantes_service_1.ComprobantesService,
        pdf_service_1.PdfService])
], ComprobantesController);
//# sourceMappingURL=comprobantes.controller.js.map