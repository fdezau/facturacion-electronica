import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        usuario: {
            id: any;
            nombre: any;
            email: any;
            rol: any;
        };
    }>;
    register(dto: RegisterDto): Promise<any>;
    perfil(req: any): Promise<any>;
}
