import { Module } from '@nestjs/common'
import { ComprobantesService } from './comprobantes.service'
import { ComprobantesController } from './comprobantes.controller'
import { PrismaService } from '../prisma.service'
import { PdfModule } from '../pdf/pdf.module'

@Module({
  imports: [PdfModule],
  controllers: [ComprobantesController],
  providers: [ComprobantesService, PrismaService],
  exports: [ComprobantesService],
})
export class ComprobantesModule {}
