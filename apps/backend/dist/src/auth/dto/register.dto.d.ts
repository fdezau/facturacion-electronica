import { Rol } from '@prisma/client';
export declare class RegisterDto {
    nombre: string;
    email: string;
    password: string;
    rol?: Rol;
}
