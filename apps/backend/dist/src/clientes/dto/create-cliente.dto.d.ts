import { TipoDocumento } from '../../common/enums';
export declare class CreateClienteDto {
    tipoDoc: TipoDocumento;
    numDoc: string;
    razonSocial: string;
    direccion?: string;
    email?: string;
    telefono?: string;
}
