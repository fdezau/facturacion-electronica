import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
export declare class ProductosController {
    private productosService;
    constructor(productosService: ProductosService);
    crear(dto: CreateProductoDto): Promise<any>;
    listar(busqueda?: string, soloActivos?: string): Promise<any>;
    obtenerPorId(id: string): Promise<any>;
    actualizar(id: string, dto: UpdateProductoDto): Promise<any>;
    eliminar(id: string): Promise<any>;
}
