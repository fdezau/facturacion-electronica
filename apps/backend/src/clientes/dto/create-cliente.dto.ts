import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator'
import { TipoDocumento } from '../../common/enums'

export class CreateClienteDto {
  @IsEnum(TipoDocumento)
  tipoDoc: TipoDocumento

  @IsString()
  numDoc: string

  @IsString()
  razonSocial: string

  @IsString()
  @IsOptional()
  direccion?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  telefono?: string
}
