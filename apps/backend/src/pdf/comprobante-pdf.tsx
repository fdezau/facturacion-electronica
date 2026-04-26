import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Font
} from '@react-pdf/renderer'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(n)

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1e293b' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, borderBottomWidth: 2, borderBottomColor: '#2563eb', paddingBottom: 16 },
  empresa: { flex: 1 },
  empresaNombre: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#2563eb', marginBottom: 4 },
  empresaDatos: { fontSize: 9, color: '#64748b', marginBottom: 2 },
  comprobanteBadge: { alignItems: 'flex-end' },
  badgeBox: { backgroundColor: '#2563eb', padding: '8 16', borderRadius: 6 },
  badgeTipo: { color: 'white', fontFamily: 'Helvetica-Bold', fontSize: 14 },
  badgeNumero: { color: 'white', fontSize: 10, marginTop: 4, textAlign: 'center' },
  seccion: { marginBottom: 16 },
  seccionTitulo: { fontSize: 9, color: '#64748b', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Helvetica-Bold' },
  clienteBox: { backgroundColor: '#f8fafc', padding: 10, borderRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' },
  clienteNombre: { fontFamily: 'Helvetica-Bold', fontSize: 11, marginBottom: 3 },
  clienteDato: { color: '#64748b', fontSize: 9, marginBottom: 2 },
  tabla: { marginBottom: 16 },
  tablaHeader: { flexDirection: 'row', backgroundColor: '#2563eb', padding: '6 8', borderRadius: 4 },
  tablaHeaderText: { color: 'white', fontFamily: 'Helvetica-Bold', fontSize: 9 },
  tablaFila: { flexDirection: 'row', padding: '6 8', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tablaFilaImpar: { backgroundColor: '#f8fafc' },
  colDesc: { flex: 3 },
  colNum: { flex: 1, textAlign: 'right' },
  totalesBox: { alignItems: 'flex-end', marginBottom: 24 },
  totalesInner: { width: 220 },
  totalesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalesLabel: { color: '#64748b', fontSize: 9 },
  totalesValue: { fontSize: 9 },
  totalFinalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 2, borderTopColor: '#2563eb', paddingTop: 6, marginTop: 4 },
  totalFinalLabel: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: '#2563eb' },
  totalFinalValue: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: '#2563eb' },
  footer: { borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#94a3b8' },
  observaciones: { backgroundColor: '#f8fafc', padding: 8, borderRadius: 4, marginBottom: 16 },
  observacionesText: { fontSize: 9, color: '#64748b' },
})

export function ComprobantePDF({ comprobante }: { comprobante: any }) {
  const { empresa, cliente, items, tipoComprobante, serie, correlativo, fechaEmision } = comprobante
  const fecha = new Date(fechaEmision).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.empresa}>
            <Text style={styles.empresaNombre}>{empresa.nombreComercial ?? empresa.razonSocial}</Text>
            <Text style={styles.empresaDatos}>{empresa.razonSocial}</Text>
            <Text style={styles.empresaDatos}>RUC: {empresa.ruc}</Text>
            <Text style={styles.empresaDatos}>{empresa.direccion}</Text>
            {empresa.telefono && <Text style={styles.empresaDatos}>Tel: {empresa.telefono}</Text>}
            {empresa.email && <Text style={styles.empresaDatos}>{empresa.email}</Text>}
          </View>
          <View style={styles.comprobanteBadge}>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeTipo}>{tipoComprobante}</Text>
              <Text style={styles.badgeNumero}>{serie}-{correlativo}</Text>
            </View>
            <Text style={{ fontSize: 9, color: '#64748b', marginTop: 6 }}>Fecha: {fecha}</Text>
            <Text style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>Moneda: {comprobante.moneda}</Text>
          </View>
        </View>

        {/* Cliente */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Datos del Cliente</Text>
          <View style={styles.clienteBox}>
            <Text style={styles.clienteNombre}>{cliente.razonSocial}</Text>
            <Text style={styles.clienteDato}>{cliente.tipoDoc}: {cliente.numDoc}</Text>
            {cliente.direccion && <Text style={styles.clienteDato}>Dirección: {cliente.direccion}</Text>}
            {cliente.email && <Text style={styles.clienteDato}>Email: {cliente.email}</Text>}
            {cliente.telefono && <Text style={styles.clienteDato}>Tel: {cliente.telefono}</Text>}
          </View>
        </View>

        {/* Tabla items */}
        <View style={styles.tabla}>
          <Text style={styles.seccionTitulo}>Detalle</Text>
          <View style={styles.tablaHeader}>
            <Text style={[styles.tablaHeaderText, styles.colDesc]}>Descripción</Text>
            <Text style={[styles.tablaHeaderText, styles.colNum]}>Cant.</Text>
            <Text style={[styles.tablaHeaderText, styles.colNum]}>P. Unit.</Text>
            <Text style={[styles.tablaHeaderText, styles.colNum]}>Desc.</Text>
            <Text style={[styles.tablaHeaderText, styles.colNum]}>IGV</Text>
            <Text style={[styles.tablaHeaderText, styles.colNum]}>Total</Text>
          </View>
          {items.map((item: any, i: number) => (
            <View key={i} style={[styles.tablaFila, i % 2 === 1 ? styles.tablaFilaImpar : {}]}>
              <Text style={[styles.colDesc]}>{item.descripcion}</Text>
              <Text style={[styles.colNum]}>{Number(item.cantidad).toFixed(2)}</Text>
              <Text style={[styles.colNum]}>{fmt(Number(item.precioUnitario))}</Text>
              <Text style={[styles.colNum]}>{fmt(Number(item.descuento))}</Text>
              <Text style={[styles.colNum]}>{fmt(Number(item.igv))}</Text>
              <Text style={[styles.colNum]}>{fmt(Number(item.total))}</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totalesBox}>
          <View style={styles.totalesInner}>
            <View style={styles.totalesRow}>
              <Text style={styles.totalesLabel}>Subtotal:</Text>
              <Text style={styles.totalesValue}>{fmt(Number(comprobante.subtotal))}</Text>
            </View>
            <View style={styles.totalesRow}>
              <Text style={styles.totalesLabel}>IGV (18%):</Text>
              <Text style={styles.totalesValue}>{fmt(Number(comprobante.igv))}</Text>
            </View>
            <View style={styles.totalFinalRow}>
              <Text style={styles.totalFinalLabel}>TOTAL:</Text>
              <Text style={styles.totalFinalValue}>{fmt(Number(comprobante.total))}</Text>
            </View>
          </View>
        </View>

        {/* Observaciones */}
        {comprobante.observaciones && (
          <View style={styles.observaciones}>
            <Text style={[styles.observacionesText, { fontFamily: 'Helvetica-Bold', marginBottom: 3 }]}>Observaciones:</Text>
            <Text style={styles.observacionesText}>{comprobante.observaciones}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Documento generado por FDev Facturación Electrónica</Text>
          <Text style={styles.footerText}>Estado: {comprobante.estado}</Text>
        </View>

      </Page>
    </Document>
  )
}
