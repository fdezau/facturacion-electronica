"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const bcrypt = __importStar(require("bcryptjs"));
const pool = new pg_1.default.Pool({
    connectionString: 'postgresql://factuser:factpass123@localhost:5434/facturacion_db',
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Iniciando seed...');
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.usuario.upsert({
        where: { email: 'admin@fdev.pe' },
        update: {},
        create: { nombre: 'Francisco Deza', email: 'admin@fdev.pe', password: hash, rol: 'ADMIN' },
    });
    await prisma.empresa.upsert({
        where: { ruc: '20100070970' },
        update: {},
        create: {
            ruc: '20100070970',
            razonSocial: 'FDev Solutions SAC',
            nombreComercial: 'FDev',
            direccion: 'Av. La Marina 123, San Miguel',
            departamento: 'Lima', provincia: 'Lima', distrito: 'San Miguel',
            telefono: '999999999', email: 'contacto@fdev.pe',
        },
    });
    const clientes = [
        { tipoDoc: 'RUC', numDoc: '20100070970', razonSocial: 'Cliente Demo SAC', direccion: 'Av. Ejemplo 456, Lima', email: 'cliente@demo.pe', telefono: '998877665' },
        { tipoDoc: 'RUC', numDoc: '20521076137', razonSocial: 'Tecnología Peruana SAC', direccion: 'Jr. Carabaya 123, Lima', email: 'info@tecperu.pe', telefono: '997766554' },
        { tipoDoc: 'DNI', numDoc: '12345678', razonSocial: 'Juan Carlos Pérez López', direccion: 'Av. Arequipa 500, Miraflores', email: 'juan@gmail.com', telefono: '987654321' },
        { tipoDoc: 'DNI', numDoc: '87654321', razonSocial: 'María García Torres', direccion: 'Calle Las Flores 200, San Isidro', email: 'maria@gmail.com', telefono: '976543210' },
    ];
    for (const c of clientes) {
        await prisma.cliente.upsert({ where: { numDoc: c.numDoc }, update: {}, create: c });
    }
    const productos = [
        { codigo: 'SERV-001', descripcion: 'Servicio de Desarrollo Web', unidad: 'ZZ', precio: 1500, igv: true },
        { codigo: 'SERV-002', descripcion: 'Servicio de Consultoría TI', unidad: 'ZZ', precio: 800, igv: true },
        { codigo: 'SERV-003', descripcion: 'Mantenimiento de Sistemas', unidad: 'ZZ', precio: 500, igv: true },
        { codigo: 'SERV-004', descripcion: 'Auditoría de Ciberseguridad', unidad: 'ZZ', precio: 2000, igv: true },
        { codigo: 'SERV-005', descripcion: 'Desarrollo App Móvil', unidad: 'ZZ', precio: 3500, igv: true },
        { codigo: 'SERV-006', descripcion: 'Implementación ERP', unidad: 'ZZ', precio: 5000, igv: true },
    ];
    for (const p of productos) {
        await prisma.producto.upsert({ where: { codigo: p.codigo }, update: {}, create: p });
    }
    console.log('✅ Seed completado!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map