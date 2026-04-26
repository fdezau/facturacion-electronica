import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsuarioService } from '../usuario/usuario.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarioService.buscarPorEmail(dto.email)
    if (!usuario || !usuario.activo)
      throw new UnauthorizedException('Credenciales inválidas')

    const passwordOk = await bcrypt.compare(dto.password, usuario.password)
    if (!passwordOk)
      throw new UnauthorizedException('Credenciales inválidas')

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol }
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    }
  }

  async register(dto: RegisterDto) {
    return this.usuarioService.crear(dto)
  }

  async perfil(id: string) {
    return this.usuarioService.buscarPorId(id)
  }
}
