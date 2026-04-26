"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoComprobante = exports.TipoComprobante = exports.TipoDocumento = exports.Rol = void 0;
var Rol;
(function (Rol) {
    Rol["ADMIN"] = "ADMIN";
    Rol["OPERADOR"] = "OPERADOR";
})(Rol || (exports.Rol = Rol = {}));
var TipoDocumento;
(function (TipoDocumento) {
    TipoDocumento["RUC"] = "RUC";
    TipoDocumento["DNI"] = "DNI";
    TipoDocumento["CE"] = "CE";
    TipoDocumento["PASAPORTE"] = "PASAPORTE";
})(TipoDocumento || (exports.TipoDocumento = TipoDocumento = {}));
var TipoComprobante;
(function (TipoComprobante) {
    TipoComprobante["FACTURA"] = "FACTURA";
    TipoComprobante["BOLETA"] = "BOLETA";
    TipoComprobante["NOTA_CREDITO"] = "NOTA_CREDITO";
    TipoComprobante["NOTA_DEBITO"] = "NOTA_DEBITO";
})(TipoComprobante || (exports.TipoComprobante = TipoComprobante = {}));
var EstadoComprobante;
(function (EstadoComprobante) {
    EstadoComprobante["BORRADOR"] = "BORRADOR";
    EstadoComprobante["EMITIDO"] = "EMITIDO";
    EstadoComprobante["ANULADO"] = "ANULADO";
})(EstadoComprobante || (exports.EstadoComprobante = EstadoComprobante = {}));
//# sourceMappingURL=enums.js.map