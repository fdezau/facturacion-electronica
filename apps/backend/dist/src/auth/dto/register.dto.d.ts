import { Rol } from '../../common/enums';
export declare class RegisterDto {
    nombre: string;
    email: string;
    password: string;
    rol?: Rol;
}
