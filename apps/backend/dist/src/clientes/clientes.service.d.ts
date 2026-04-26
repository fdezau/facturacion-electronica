import { PrismaService } from '../prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesService {
    private prisma;
    constructor(prisma: PrismaService);
    consultarRuc(ruc: string): Promise<any>;
    consultarDni(dni: string): Promise<any>;
    autocompletar(tipoDoc: string, numDoc: string): Promise<{
        razonSocial: any;
        direccion: any;
        tipoDoc: string;
        numDoc: string;
    }>;
    crear(dto: CreateClienteDto): Promise<any>;
    listar(busqueda?: string): Promise<any>;
    obtenerPorId(id: string): Promise<any>;
    actualizar(id: string, dto: UpdateClienteDto): Promise<any>;
    eliminar(id: string): Promise<any>;
}
