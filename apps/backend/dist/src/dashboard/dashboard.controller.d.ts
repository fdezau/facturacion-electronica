import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getKpis(): Promise<{
        resumen: {
            totalFacturas: any;
            totalBoletas: any;
            totalClientes: any;
            totalProductos: any;
            comprobantesAnulados: any;
        };
        ventasMes: {
            subtotal: any;
            igv: any;
            total: any;
            cantidad: any;
        };
        ventasAnio: {
            total: any;
            cantidad: any;
        };
        ultimosComprobantes: any;
    }>;
    getVentasPorMes(): Promise<{
        mes: string;
        total: any;
        cantidad: any;
    }[]>;
}
