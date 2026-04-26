import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        usuario: {
            id: string;
            nombre: string;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: import("@prisma/client").$Enums.Rol;
        createdAt: Date;
    }>;
    perfil(req: any): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: import("@prisma/client").$Enums.Rol;
        activo: boolean;
    }>;
}
