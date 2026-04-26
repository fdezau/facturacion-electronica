import { PrismaService } from '../prisma.service';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { TipoComprobante, EstadoComprobante } from '../common/enums';
export declare class ComprobantesService {
    private prisma;
    constructor(prisma: PrismaService);
    private generarSerie;
    private calcularTotales;
    crear(dto: CreateComprobanteDto): Promise<any>;
    listar(filtros?: {
        tipo?: TipoComprobante;
        estado?: EstadoComprobante;
        clienteId?: string;
    }): Promise<any>;
    obtenerPorId(id: string): Promise<any>;
    anular(id: string): Promise<any>;
    estadisticas(): Promise<{
        facturas: any;
        boletas: any;
        totalMes: any;
        igvMes: any;
        comprobantesAnulados: any;
    }>;
}
