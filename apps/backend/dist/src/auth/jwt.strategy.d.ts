import { Strategy } from 'passport-jwt';
import { UsuarioService } from '../usuario/usuario.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usuarioService;
    constructor(usuarioService: UsuarioService);
    validate(payload: {
        sub: string;
        email: string;
        rol: string;
    }): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: import("@prisma/client").$Enums.Rol;
        activo: boolean;
    }>;
}
export {};
