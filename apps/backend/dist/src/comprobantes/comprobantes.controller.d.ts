import { Response } from 'express';
import { ComprobantesService } from './comprobantes.service';
import { PdfService } from '../pdf/pdf.service';
import { XmlService } from '../xml/xml.service';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { TipoComprobante, EstadoComprobante } from '../common/enums';
export declare class ComprobantesController {
    private comprobantesService;
    private pdfService;
    private xmlService;
    constructor(comprobantesService: ComprobantesService, pdfService: PdfService, xmlService: XmlService);
    crear(dto: CreateComprobanteDto): Promise<any>;
    listar(tipo?: TipoComprobante, estado?: EstadoComprobante, clienteId?: string): Promise<any>;
    estadisticas(): Promise<{
        facturas: any;
        boletas: any;
        totalMes: any;
        igvMes: any;
        comprobantesAnulados: any;
    }>;
    obtenerPorId(id: string): Promise<any>;
    descargarPdf(id: string, res: Response): Promise<void>;
    descargarXml(id: string, res: Response): Promise<void>;
    anular(id: string): Promise<any>;
}
