export interface Empresa {
  id: string
  ruc: string
  razonSocial: string
  nombreComercial?: string
  direccion: string
  departamento?: string
  provincia?: string
  distrito?: string
  telefono?: string
  email?: string
  logo?: string
}

export interface Cliente {
  id: string
  tipoDoc: 'RUC' | 'DNI' | 'CE' | 'PASAPORTE'
  numDoc: string
  razonSocial: string
  direccion?: string
  email?: string
  telefono?: string
}

export interface Producto {
  id: string
  codigo: string
  descripcion: string
  unidad: string
  precio: number
  igv: boolean
  activo: boolean
}

export interface ComprobanteItem {
  id: string
  descripcion: string
  cantidad: number
  unidad: string
  precioUnitario: number
  descuento: number
  subtotal: number
  igv: number
  total: number
  afectaIgv: boolean
}

export interface Comprobante {
  id: string
  serie: string
  correlativo: string
  tipoComprobante: 'FACTURA' | 'BOLETA' | 'NOTA_CREDITO' | 'NOTA_DEBITO'
  fechaEmision: string
  fechaVencimiento?: string
  cliente: Cliente
  empresa: Empresa
  subtotal: number
  igv: number
  total: number
  moneda: string
  observaciones?: string
  estado: 'BORRADOR' | 'EMITIDO' | 'ANULADO'
  items: ComprobanteItem[]
}

export interface DashboardKpis {
  resumen: {
    totalFacturas: number
    totalBoletas: number
    totalClientes: number
    totalProductos: number
    comprobantesAnulados: number
  }
  ventasMes: {
    subtotal: number
    igv: number
    total: number
    cantidad: number
  }
  ventasAnio: {
    total: number
    cantidad: number
  }
  ultimosComprobantes: {
    id: string
    serie: string
    correlativo: string
    tipo: string
    cliente: string
    total: number
    estado: string
    fecha: string
  }[]
}
