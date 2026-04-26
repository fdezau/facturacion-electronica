import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesController {
    private clientesService;
    constructor(clientesService: ClientesService);
    autocompletar(tipoDoc: string, numDoc: string): Promise<{
        razonSocial: any;
        direccion: any;
        tipoDoc: string;
        numDoc: string;
    }>;
    consultarRuc(ruc: string): Promise<any>;
    consultarDni(dni: string): Promise<any>;
    crear(dto: CreateClienteDto): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        razonSocial: string;
        direccion: string | null;
        telefono: string | null;
        numDoc: string;
        tipoDoc: import("@prisma/client").$Enums.TipoDocumento;
    }>;
    listar(busqueda?: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        razonSocial: string;
        direccion: string | null;
        telefono: string | null;
        numDoc: string;
        tipoDoc: import("@prisma/client").$Enums.TipoDocumento;
    }[]>;
    obtenerPorId(id: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        razonSocial: string;
        direccion: string | null;
        telefono: string | null;
        numDoc: string;
        tipoDoc: import("@prisma/client").$Enums.TipoDocumento;
    }>;
    actualizar(id: string, dto: UpdateClienteDto): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        razonSocial: string;
        direccion: string | null;
        telefono: string | null;
        numDoc: string;
        tipoDoc: import("@prisma/client").$Enums.TipoDocumento;
    }>;
    eliminar(id: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        razonSocial: string;
        direccion: string | null;
        telefono: string | null;
        numDoc: string;
        tipoDoc: import("@prisma/client").$Enums.TipoDocumento;
    }>;
}
