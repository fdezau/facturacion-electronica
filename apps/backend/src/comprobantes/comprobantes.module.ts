import { Module } from '@nestjs/common'
import { ComprobantesService } from './comprobantes.service'
import { ComprobantesController } from './comprobantes.controller'
import { PrismaService } from '../prisma.service'

@Module({
  controllers: [ComprobantesController],
  providers: [ComprobantesService, PrismaService],
  exports: [ComprobantesService],
})
export class ComprobantesModule {}
