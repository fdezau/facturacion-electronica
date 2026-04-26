import { IsString, IsBoolean, IsOptional, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProductoDto {
  @IsString()
  codigo: string

  @IsString()
  descripcion: string

  @IsString()
  @IsOptional()
  unidad?: string

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  precio: number

  @IsBoolean()
  @IsOptional()
  igv?: boolean

  @IsBoolean()
  @IsOptional()
  activo?: boolean
}
