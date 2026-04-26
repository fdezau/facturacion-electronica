import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
export declare class ProductosController {
    private productosService;
    constructor(productosService: ProductosService);
    crear(dto: CreateProductoDto): Promise<{
        id: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
        codigo: string;
        descripcion: string;
        unidad: string;
        precio: import("@prisma/client/runtime/client").Decimal;
        igv: boolean;
    }>;
    listar(busqueda?: string, soloActivos?: string): Promise<{
        id: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
        codigo: string;
        descripcion: string;
        unidad: string;
        precio: import("@prisma/client/runtime/client").Decimal;
        igv: boolean;
    }[]>;
    obtenerPorId(id: string): Promise<{
        id: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
        codigo: string;
        descripcion: string;
        unidad: string;
        precio: import("@prisma/client/runtime/client").Decimal;
        igv: boolean;
    }>;
    actualizar(id: string, dto: UpdateProductoDto): Promise<{
        id: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
        codigo: string;
        descripcion: string;
        unidad: string;
        precio: import("@prisma/client/runtime/client").Decimal;
        igv: boolean;
    }>;
    eliminar(id: string): Promise<{
        id: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
        codigo: string;
        descripcion: string;
        unidad: string;
        precio: import("@prisma/client/runtime/client").Decimal;
        igv: boolean;
    }>;
}
