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
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        razonSocial: string;
        direccion: string | null;
        telefono: string | null;
        tipoDoc: import("@prisma/client").$Enums.TipoDocumento;
        numDoc: string;
    }>;
    listar(busqueda?: string): Promise<{
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        razonSocial: string;
        direccion: string | null;
        telefono: string | null;
        tipoDoc: import("@prisma/client").$Enums.TipoDocumento;
        numDoc: string;
    }[]>;
    obtenerPorId(id: string): Promise<{
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        razonSocial: string;
        direccion: string | null;
        telefono: string | null;
        tipoDoc: import("@prisma/client").$Enums.TipoDocumento;
        numDoc: string;
    }>;
    actualizar(id: string, dto: UpdateClienteDto): Promise<{
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        razonSocial: string;
        direccion: string | null;
        telefono: string | null;
        tipoDoc: import("@prisma/client").$Enums.TipoDocumento;
        numDoc: string;
    }>;
    eliminar(id: string): Promise<{
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        razonSocial: string;
        direccion: string | null;
        telefono: string | null;
        tipoDoc: import("@prisma/client").$Enums.TipoDocumento;
        numDoc: string;
    }>;
}
