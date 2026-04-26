import { PrismaService } from '../prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
export declare class UsuarioService {
    private prisma;
    constructor(prisma: PrismaService);
    crear(dto: RegisterDto): Promise<any>;
    buscarPorEmail(email: string): Promise<any>;
    buscarPorId(id: string): Promise<any>;
}
