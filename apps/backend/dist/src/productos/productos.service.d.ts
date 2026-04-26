import { PrismaService } from '../prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
export declare class ProductosService {
    private prisma;
    constructor(prisma: PrismaService);
    crear(dto: CreateProductoDto): Promise<any>;
    listar(busqueda?: string, soloActivos?: boolean): Promise<any>;
    obtenerPorId(id: string): Promise<any>;
    actualizar(id: string, dto: UpdateProductoDto): Promise<any>;
    eliminar(id: string): Promise<any>;
}
