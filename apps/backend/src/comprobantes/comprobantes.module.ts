import { Module } from '@nestjs/common'
import { ComprobantesService } from './comprobantes.service'
import { ComprobantesController } from './comprobantes.controller'
import { PrismaService } from '../prisma.service'
import { PdfModule } from '../pdf/pdf.module'
import { XmlModule } from '../xml/xml.module'

@Module({
  imports: [PdfModule, XmlModule],
  controllers: [ComprobantesController],
  providers: [ComprobantesService, PrismaService],
  exports: [ComprobantesService],
})
export class ComprobantesModule {}
