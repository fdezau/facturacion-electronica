import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator'
import { Rol } from '@prisma/client'

export class RegisterDto {
  @IsString()
  nombre: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsEnum(Rol)
  @IsOptional()
  rol?: Rol
}
