"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlService = void 0;
const common_1 = require("@nestjs/common");
const xmlbuilder2_1 = require("xmlbuilder2");
let XmlService = class XmlService {
    generarComprobante(comprobante) {
        const esFactura = comprobante.tipoComprobante === 'FACTURA';
        const tipoDoc = esFactura ? '01' : '03';
        const fecha = new Date(comprobante.fechaEmision).toISOString().split('T')[0];
        const { empresa, cliente, items } = comprobante;
        const root = (0, xmlbuilder2_1.create)({ version: '1.0', encoding: 'UTF-8' })
            .ele('Invoice', {
            xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
            'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
            'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
            'xmlns:ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
        });
        root.ele('ext:UBLExtensions')
            .ele('ext:UBLExtension')
            .ele('ext:ExtensionContent').up()
            .up()
            .up();
        root.ele('cbc:UBLVersionID').txt('2.1').up();
        root.ele('cbc:CustomizationID').txt('2.0').up();
        root.ele('cbc:ID').txt(`${comprobante.serie}-${comprobante.correlativo}`).up();
        root.ele('cbc:IssueDate').txt(fecha).up();
        root.ele('cbc:IssueTime').txt('00:00:00').up();
        root.ele('cbc:InvoiceTypeCode', { listID: tipoDoc }).txt(tipoDoc).up();
        root.ele('cbc:Note', { languageLocaleID: '1000' })
            .txt(this.numeroALetras(Number(comprobante.total))).up();
        root.ele('cbc:DocumentCurrencyCode').txt(comprobante.moneda ?? 'PEN').up();
        root.ele('cbc:LineCountNumeric').txt(String(items.length)).up();
        const supplier = root.ele('cac:AccountingSupplierParty')
            .ele('cac:Party');
        supplier.ele('cac:PartyIdentification')
            .ele('cbc:ID', { schemeID: '6' }).txt(empresa.ruc).up()
            .up();
        supplier.ele('cac:PartyName')
            .ele('cbc:Name').txt(empresa.nombreComercial ?? empresa.razonSocial).up()
            .up();
        supplier.ele('cac:PartyLegalEntity')
            .ele('cbc:RegistrationName').txt(empresa.razonSocial).up()
            .ele('cac:RegistrationAddress')
            .ele('cbc:AddressTypeCode').txt('0000').up()
            .up()
            .up();
        const schemeID = cliente.tipoDoc === 'RUC' ? '6' : cliente.tipoDoc === 'DNI' ? '1' : '7';
        const customer = root.ele('cac:AccountingCustomerParty')
            .ele('cac:Party');
        customer.ele('cac:PartyIdentification')
            .ele('cbc:ID', { schemeID }).txt(cliente.numDoc).up()
            .up();
        customer.ele('cac:PartyLegalEntity')
            .ele('cbc:RegistrationName').txt(cliente.razonSocial).up()
            .up();
        const subtotal = Number(comprobante.subtotal);
        const igv = Number(comprobante.igv);
        const total = Number(comprobante.total);
        root.ele('cac:TaxTotal')
            .ele('cbc:TaxAmount', { currencyID: 'PEN' }).txt(igv.toFixed(2)).up()
            .ele('cac:TaxSubtotal')
            .ele('cbc:TaxableAmount', { currencyID: 'PEN' }).txt(subtotal.toFixed(2)).up()
            .ele('cbc:TaxAmount', { currencyID: 'PEN' }).txt(igv.toFixed(2)).up()
            .ele('cac:TaxCategory')
            .ele('cbc:ID').txt('S').up()
            .ele('cbc:Percent').txt('18').up()
            .ele('cbc:TaxExemptionReasonCode').txt('10').up()
            .ele('cac:TaxScheme')
            .ele('cbc:ID').txt('1000').up()
            .ele('cbc:Name').txt('IGV').up()
            .ele('cbc:TaxTypeCode').txt('VAT').up()
            .up()
            .up()
            .up()
            .up();
        root.ele('cac:LegalMonetaryTotal')
            .ele('cbc:LineExtensionAmount', { currencyID: 'PEN' }).txt(subtotal.toFixed(2)).up()
            .ele('cbc:TaxInclusiveAmount', { currencyID: 'PEN' }).txt(total.toFixed(2)).up()
            .ele('cbc:PayableAmount', { currencyID: 'PEN' }).txt(total.toFixed(2)).up()
            .up();
        items.forEach((item, idx) => {
            const itemSubtotal = Number(item.subtotal);
            const itemIgv = Number(item.igv);
            const itemTotal = Number(item.total);
            const line = root.ele('cac:InvoiceLine');
            line.ele('cbc:ID').txt(String(idx + 1)).up();
            line.ele('cbc:InvoicedQuantity', { unitCode: item.unidad ?? 'NIU' })
                .txt(Number(item.cantidad).toFixed(2)).up();
            line.ele('cbc:LineExtensionAmount', { currencyID: 'PEN' })
                .txt(itemSubtotal.toFixed(2)).up();
            line.ele('cac:PricingReference')
                .ele('cac:AlternativeConditionPrice')
                .ele('cbc:PriceAmount', { currencyID: 'PEN' })
                .txt(itemTotal.toFixed(2)).up()
                .ele('cbc:PriceTypeCode').txt('01').up()
                .up()
                .up();
            line.ele('cac:TaxTotal')
                .ele('cbc:TaxAmount', { currencyID: 'PEN' }).txt(itemIgv.toFixed(2)).up()
                .ele('cac:TaxSubtotal')
                .ele('cbc:TaxableAmount', { currencyID: 'PEN' }).txt(itemSubtotal.toFixed(2)).up()
                .ele('cbc:TaxAmount', { currencyID: 'PEN' }).txt(itemIgv.toFixed(2)).up()
                .ele('cac:TaxCategory')
                .ele('cbc:ID').txt('S').up()
                .ele('cbc:Percent').txt('18').up()
                .ele('cbc:TaxExemptionReasonCode').txt('10').up()
                .ele('cac:TaxScheme')
                .ele('cbc:ID').txt('1000').up()
                .ele('cbc:Name').txt('IGV').up()
                .ele('cbc:TaxTypeCode').txt('VAT').up()
                .up()
                .up()
                .up()
                .up();
            line.ele('cac:Item')
                .ele('cbc:Description').txt(item.descripcion).up()
                .up();
            line.ele('cac:Price')
                .ele('cbc:PriceAmount', { currencyID: 'PEN' })
                .txt(Number(item.precioUnitario).toFixed(2)).up()
                .up();
        });
        return root.end({ prettyPrint: true });
    }
    numeroALetras(monto) {
        const entero = Math.floor(monto);
        const decimales = Math.round((monto - entero) * 100);
        return `SON ${entero} CON ${decimales.toString().padStart(2, '0')}/100 SOLES`;
    }
};
exports.XmlService = XmlService;
exports.XmlService = XmlService = __decorate([
    (0, common_1.Injectable)()
], XmlService);
//# sourceMappingURL=xml.service.js.map