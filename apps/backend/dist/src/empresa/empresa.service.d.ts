import { PrismaService } from '../prisma.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
export declare class EmpresaService {
    private prisma;
    constructor(prisma: PrismaService);
    crear(dto: CreateEmpresaDto): Promise<any>;
    obtener(): Promise<any>;
    obtenerPrincipal(): Promise<any>;
    obtenerPorId(id: string): Promise<any>;
    actualizar(id: string, dto: UpdateEmpresaDto): Promise<any>;
    eliminar(id: string): Promise<any>;
}
