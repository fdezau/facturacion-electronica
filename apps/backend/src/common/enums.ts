export enum Rol {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR',
}

export enum TipoDocumento {
  RUC = 'RUC',
  DNI = 'DNI',
  CE = 'CE',
  PASAPORTE = 'PASAPORTE',
}

export enum TipoComprobante {
  FACTURA = 'FACTURA',
  BOLETA = 'BOLETA',
  NOTA_CREDITO = 'NOTA_CREDITO',
  NOTA_DEBITO = 'NOTA_DEBITO',
}

export enum EstadoComprobante {
  BORRADOR = 'BORRADOR',
  EMITIDO = 'EMITIDO',
  ANULADO = 'ANULADO',
}
