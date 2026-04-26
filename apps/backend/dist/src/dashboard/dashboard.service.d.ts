import { PrismaService } from '../prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getKpis(): Promise<{
        resumen: {
            totalFacturas: number;
            totalBoletas: number;
            totalClientes: number;
            totalProductos: number;
            comprobantesAnulados: number;
        };
        ventasMes: {
            subtotal: number | import("@prisma/client/runtime/client").Decimal;
            igv: number | import("@prisma/client/runtime/client").Decimal;
            total: number | import("@prisma/client/runtime/client").Decimal;
            cantidad: number;
        };
        ventasAnio: {
            total: number | import("@prisma/client/runtime/client").Decimal;
            cantidad: number;
        };
        ultimosComprobantes: {
            id: string;
            serie: string;
            correlativo: string;
            tipo: import("@prisma/client").$Enums.TipoComprobante;
            cliente: string;
            total: import("@prisma/client/runtime/client").Decimal;
            estado: import("@prisma/client").$Enums.EstadoComprobante;
            fecha: Date;
        }[];
    }>;
    getVentasPorMes(): Promise<{
        mes: string;
        total: number | import("@prisma/client/runtime/client").Decimal;
        cantidad: number;
    }[]>;
}
