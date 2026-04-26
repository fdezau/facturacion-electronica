import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './prisma.service'
import { AuthModule } from './auth/auth.module'
import { UsuarioModule } from './usuario/usuario.module'
import { EmpresaModule } from './empresa/empresa.module'
import { ClientesModule } from './clientes/clientes.module'
import { ProductosModule } from './productos/productos.module'
import { ComprobantesModule } from './comprobantes/comprobantes.module'
import { DashboardModule } from './dashboard/dashboard.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsuarioModule,
    EmpresaModule,
    ClientesModule,
    ProductosModule,
    ComprobantesModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
