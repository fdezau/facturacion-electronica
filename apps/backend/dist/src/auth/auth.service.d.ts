import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usuarioService;
    private jwtService;
    constructor(usuarioService: UsuarioService, jwtService: JwtService);
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
    perfil(id: string): Promise<any>;
}
