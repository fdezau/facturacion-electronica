import { PrismaService } from '../prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
export declare class UsuarioService {
    private prisma;
    constructor(prisma: PrismaService);
    crear(dto: RegisterDto): Promise<{
        nombre: string;
        email: string;
        rol: import("@prisma/client").$Enums.Rol;
        id: string;
        createdAt: Date;
    }>;
    buscarPorEmail(email: string): Promise<{
        nombre: string;
        email: string;
        password: string;
        rol: import("@prisma/client").$Enums.Rol;
        id: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    buscarPorId(id: string): Promise<{
        nombre: string;
        email: string;
        rol: import("@prisma/client").$Enums.Rol;
        id: string;
        activo: boolean;
    }>;
}
