import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { RegisterDto } from '../auth/dto/register.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: RegisterDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    })
    if (existe) throw new ConflictException('El email ya está registrado')

    const hash = await bcrypt.hash(dto.password, 10)
    return this.prisma.usuario.create({
      data: { ...dto, password: hash },
      select: { id: true, nombre: true, email: true, rol: true, createdAt: true },
    })
  }

  async buscarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } })
  }

  async buscarPorId(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nombre: true, email: true, rol: true, activo: true },
    })
    if (!usuario) throw new NotFoundException('Usuario no encontrado')
    return usuario
  }
}
