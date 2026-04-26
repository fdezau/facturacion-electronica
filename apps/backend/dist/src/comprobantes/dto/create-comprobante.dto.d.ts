import { TipoComprobante } from '../../common/enums';
export declare class CreateItemDto {
    productoId?: string;
    descripcion: string;
    cantidad: number;
    unidad?: string;
    precioUnitario: number;
    descuento?: number;
    afectaIgv?: boolean;
}
export declare class CreateComprobanteDto {
    tipoComprobante: TipoComprobante;
    clienteId: string;
    empresaId: string;
    moneda?: string;
    observaciones?: string;
    fechaVencimiento?: string;
    items: CreateItemDto[];
}
