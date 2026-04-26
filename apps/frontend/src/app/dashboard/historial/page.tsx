'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, XCircle, FileText, Eye } from 'lucide-react'
import { toast } from 'sonner'
import type { Comprobante } from '@/types'

const fmt = (n: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(n)

const estadoBadge = (estado: string) => {
  if (estado === 'EMITIDO') return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">EMITIDO</Badge>
  if (estado === 'ANULADO') return <Badge variant="destructive">ANULADO</Badge>
  return <Badge variant="secondary">{estado}</Badge>
}

const tipoBadge = (tipo: string) => {
  if (tipo === 'FACTURA') return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">FACTURA</Badge>
  if (tipo === 'BOLETA') return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">BOLETA</Badge>
  return <Badge variant="outline">{tipo}</Badge>
}

export default function HistorialPage() {
  const queryClient = useQueryClient()
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [detalle, setDetalle] = useState<Comprobante | null>(null)

  const { data: comprobantes, isLoading } = useQuery<Comprobante[]>({
    queryKey: ['comprobantes', filtroTipo],
    queryFn: () => api.get(`/comprobantes${filtroTipo ? `?tipo=${filtroTipo}` : ''}`).then(r => r.data),
  })

  const anularMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/comprobantes/${id}/anular`).then(r => r.data),
    onSuccess: () => {
      toast.success('Comprobante anulado')
      queryClient.invalidateQueries({ queryKey: ['comprobantes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] })
      setDetalle(null)
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Error al anular'),
  })

  const filtrados = comprobantes?.filter(c =>
    c.cliente.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
    `${c.serie}-${c.correlativo}`.includes(busqueda)
  ) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Historial de Comprobantes</h1>
        <p className="text-slate-500 text-sm mt-1">Consulta y gestiona todos tus comprobantes emitidos</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input placeholder="Buscar por cliente o número..." className="pl-9" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        {['', 'FACTURA', 'BOLETA', 'NOTA_CREDITO'].map(tipo => (
          <Button key={tipo} variant={filtroTipo === tipo ? 'default' : 'outline'} size="sm"
            onClick={() => setFiltroTipo(tipo)}
            className={filtroTipo === tipo ? 'bg-blue-600' : ''}>
            {tipo || 'Todos'}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={detalle ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                          No hay comprobantes
                        </TableCell>
                      </TableRow>
                    ) : filtrados.map(c => (
                      <TableRow key={c.id} className="cursor-pointer hover:bg-slate-50">
                        <TableCell className="font-mono text-sm font-medium">{c.serie}-{c.correlativo}</TableCell>
                        <TableCell>{tipoBadge(c.tipoComprobante)}</TableCell>
                        <TableCell className="text-sm">{c.cliente.razonSocial}</TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(c.fechaEmision).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell className="text-right font-semibold">{fmt(Number(c.total))}</TableCell>
                        <TableCell>{estadoBadge(c.estado)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setDetalle(c)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel detalle */}
        {detalle && (
          <div>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Detalle</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setDetalle(null)}>✕</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-mono font-bold">{detalle.serie}-{detalle.correlativo}</span>
                  {tipoBadge(detalle.tipoComprobante)}
                </div>

                <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                  <p className="text-xs text-slate-500">Cliente</p>
                  <p className="font-medium">{detalle.cliente.razonSocial}</p>
                  <p className="text-slate-500">{detalle.cliente.tipoDoc}: {detalle.cliente.numDoc}</p>
                  {detalle.cliente.direccion && <p className="text-slate-500 text-xs">{detalle.cliente.direccion}</p>}
                </div>

                <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                  <p className="text-xs text-slate-500">Emisor</p>
                  <p className="font-medium">{detalle.empresa.razonSocial}</p>
                  <p className="text-slate-500">RUC: {detalle.empresa.ruc}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-2">Ítems</p>
                  <div className="space-y-2">
                    {detalle.items.map((item, i) => (
                      <div key={i} className="border rounded p-2">
                        <p className="font-medium text-xs">{item.descripcion}</p>
                        <p className="text-slate-500 text-xs">{item.cantidad} x {fmt(Number(item.precioUnitario))}</p>
                        <p className="text-right font-semibold text-xs">{fmt(Number(item.total))}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3 space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Subtotal</span><span>{fmt(Number(detalle.subtotal))}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>IGV</span><span>{fmt(Number(detalle.igv))}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span><span className="text-blue-600">{fmt(Number(detalle.total))}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {estadoBadge(detalle.estado)}
                  <span className="text-xs text-slate-400">
                    {new Date(detalle.fechaEmision).toLocaleDateString('es-PE')}
                  </span>
                </div>

                {detalle.estado === 'EMITIDO' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => anularMutation.mutate(detalle.id)}
                    disabled={anularMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Anular Comprobante
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
