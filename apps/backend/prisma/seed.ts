import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as bcrypt from 'bcryptjs'

const pool = new pg.Pool({
  connectionString: 'postgresql://factuser:factpass123@localhost:5434/facturacion_db',
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Iniciando seed...')

  // Usuario admin
  const hash = await bcrypt.hash('admin123', 10)
  await prisma.usuario.upsert({
    where: { email: 'admin@fdev.pe' },
    update: {},
    create: { nombre: 'Francisco Deza', email: 'admin@fdev.pe', password: hash, rol: 'ADMIN' },
  })

  // Empresa
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
  })

  // Clientes
  const clientes = [
    { tipoDoc: 'RUC' as const, numDoc: '20100070970', razonSocial: 'Cliente Demo SAC', direccion: 'Av. Ejemplo 456, Lima', email: 'cliente@demo.pe', telefono: '998877665' },
    { tipoDoc: 'RUC' as const, numDoc: '20521076137', razonSocial: 'Tecnología Peruana SAC', direccion: 'Jr. Carabaya 123, Lima', email: 'info@tecperu.pe', telefono: '997766554' },
    { tipoDoc: 'DNI' as const, numDoc: '12345678', razonSocial: 'Juan Carlos Pérez López', direccion: 'Av. Arequipa 500, Miraflores', email: 'juan@gmail.com', telefono: '987654321' },
    { tipoDoc: 'DNI' as const, numDoc: '87654321', razonSocial: 'María García Torres', direccion: 'Calle Las Flores 200, San Isidro', email: 'maria@gmail.com', telefono: '976543210' },
  ]
  for (const c of clientes) {
    await prisma.cliente.upsert({ where: { numDoc: c.numDoc }, update: {}, create: c })
  }

  // Productos
  const productos = [
    { codigo: 'SERV-001', descripcion: 'Servicio de Desarrollo Web', unidad: 'ZZ', precio: 1500, igv: true },
    { codigo: 'SERV-002', descripcion: 'Servicio de Consultoría TI', unidad: 'ZZ', precio: 800, igv: true },
    { codigo: 'SERV-003', descripcion: 'Mantenimiento de Sistemas', unidad: 'ZZ', precio: 500, igv: true },
    { codigo: 'SERV-004', descripcion: 'Auditoría de Ciberseguridad', unidad: 'ZZ', precio: 2000, igv: true },
    { codigo: 'SERV-005', descripcion: 'Desarrollo App Móvil', unidad: 'ZZ', precio: 3500, igv: true },
    { codigo: 'SERV-006', descripcion: 'Implementación ERP', unidad: 'ZZ', precio: 5000, igv: true },
  ]
  for (const p of productos) {
    await prisma.producto.upsert({ where: { codigo: p.codigo }, update: {}, create: p })
  }

  console.log('✅ Seed completado!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
