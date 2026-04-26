import { IsString, IsOptional, IsEmail, Length } from 'class-validator'

export class CreateEmpresaDto {
  @IsString()
  @Length(11, 11, { message: 'El RUC debe tener 11 dígitos' })
  ruc: string

  @IsString()
  razonSocial: string

  @IsString()
  @IsOptional()
  nombreComercial?: string

  @IsString()
  direccion: string

  @IsString()
  @IsOptional()
  ubigeo?: string

  @IsString()
  @IsOptional()
  departamento?: string

  @IsString()
  @IsOptional()
  provincia?: string

  @IsString()
  @IsOptional()
  distrito?: string

  @IsString()
  @IsOptional()
  telefono?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  logo?: string
}
