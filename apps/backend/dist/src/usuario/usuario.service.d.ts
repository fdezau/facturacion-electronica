import { PrismaService } from '../prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
export declare class UsuarioService {
    private prisma;
    constructor(prisma: PrismaService);
    crear(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: import("@prisma/client").$Enums.Rol;
        createdAt: Date;
    }>;
    buscarPorEmail(email: string): Promise<{
        id: string;
        email: string;
        nombre: string;
        password: string;
        rol: import("@prisma/client").$Enums.Rol;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    buscarPorId(id: string): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: import("@prisma/client").$Enums.Rol;
        activo: boolean;
    }>;
}
