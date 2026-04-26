import { Injectable } from '@nestjs/common'

@Injectable()
export class PdfService {
  async generarComprobante(comprobante: any): Promise<Buffer> {
    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { createElement } = await import('react')
    const { ComprobantePDF } = await import('./comprobante-pdf')
    const element = createElement(ComprobantePDF as any, { comprobante })
    const buffer = await renderToBuffer(element as any)
    return Buffer.from(buffer)
  }
}
