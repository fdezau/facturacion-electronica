import { IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsNumber, IsBoolean, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { TipoComprobante } from '../../common/enums'

export class CreateItemDto {
  @IsString()
  @IsOptional()
  productoId?: string

  @IsString()
  descripcion: string

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Type(() => Number)
  cantidad: number

  @IsString()
  @IsOptional()
  unidad?: string

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  precioUnitario: number

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Type(() => Number)
  descuento?: number

  @IsBoolean()
  @IsOptional()
  afectaIgv?: boolean
}

export class CreateComprobanteDto {
  @IsEnum(TipoComprobante)
  tipoComprobante: TipoComprobante

  @IsString()
  clienteId: string

  @IsString()
  empresaId: string

  @IsString()
  @IsOptional()
  moneda?: string

  @IsString()
  @IsOptional()
  observaciones?: string

  @IsString()
  @IsOptional()
  fechaVencimiento?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[]
}
