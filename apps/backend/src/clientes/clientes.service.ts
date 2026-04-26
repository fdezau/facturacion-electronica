import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CreateClienteDto } from './dto/create-cliente.dto'
import { UpdateClienteDto } from './dto/update-cliente.dto'
import axios from 'axios'

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async consultarRuc(ruc: string) {
    try {
      const { data } = await axios.get(`https://api.apis.net.pe/v2/sunat/ruc?numero=${ruc}`, {
        headers: { Authorization: `Bearer ${process.env.APIS_NET_PE_TOKEN ?? 'apis-token-demo'}` },
        timeout: 5000,
      })
      return data
    } catch {
      return null
    }
  }

  async consultarDni(dni: string) {
    try {
      const { data } = await axios.get(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
        headers: { Authorization: `Bearer ${process.env.APIS_NET_PE_TOKEN ?? 'apis-token-demo'}` },
        timeout: 5000,
      })
      return data
    } catch {
      return null
    }
  }

  async autocompletar(tipoDoc: string, numDoc: string) {
    if (tipoDoc === 'RUC') {
      if (numDoc.length !== 11) throw new BadRequestException('RUC debe tener 11 dígitos')
      const data = await this.consultarRuc(numDoc)
      if (!data) throw new NotFoundException('RUC no encontrado')
      return {
        razonSocial: data.razonSocial,
        direccion: data.direccion ?? '',
        tipoDoc: 'RUC',
        numDoc,
      }
    }
    if (tipoDoc === 'DNI') {
      if (numDoc.length !== 8) throw new BadRequestException('DNI debe tener 8 dígitos')
      const data = await this.consultarDni(numDoc)
      if (!data) throw new NotFoundException('DNI no encontrado')
      return {
        razonSocial: `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        direccion: '',
        tipoDoc: 'DNI',
        numDoc,
      }
    }
    throw new BadRequestException('Tipo de documento no soportado para autocompletar')
  }

  async crear(dto: CreateClienteDto) {
    const existe = await (this.prisma as any).cliente.findUnique({ where: { numDoc: dto.numDoc } })
    if (existe) throw new ConflictException('Ya existe un cliente con ese documento')
    return (this.prisma as any).cliente.create({ data: dto })
  }

  async listar(busqueda?: string) {
    return (this.prisma as any).cliente.findMany({
      where: busqueda
        ? {
            OR: [
              { razonSocial: { contains: busqueda, mode: 'insensitive' } },
              { numDoc: { contains: busqueda } },
            ],
          }
        : undefined,
      orderBy: { razonSocial: 'asc' },
    })
  }

  async obtenerPorId(id: string) {
    const cliente = await (this.prisma as any).cliente.findUnique({ where: { id } })
    if (!cliente) throw new NotFoundException('Cliente no encontrado')
    return cliente
  }

  async actualizar(id: string, dto: UpdateClienteDto) {
    await this.obtenerPorId(id)
    return (this.prisma as any).cliente.update({ where: { id }, data: dto })
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id)
    return (this.prisma as any).cliente.delete({ where: { id } })
  }
}
