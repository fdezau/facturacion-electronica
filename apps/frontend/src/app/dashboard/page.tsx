'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Users, Package, TrendingUp, Receipt, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { DashboardKpis } from '@/types'

const fmt = (n: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(n)

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardKpis>({
    queryKey: ['dashboard-kpis'],
    queryFn: () => api.get('/dashboard/kpis').then(r => r.data),
  })

  const { data: ventas } = useQuery({
    queryKey: ['ventas-mes'],
    queryFn: () => api.get('/dashboard/ventas-por-mes').then(r => r.data),
  })

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    </div>
  )

  const kpis = [
    { label: 'Facturas Emitidas', value: data?.resumen.totalFacturas ?? 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Boletas Emitidas', value: data?.resumen.totalBoletas ?? 0, icon: Receipt, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Clientes', value: data?.resumen.totalClientes ?? 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Productos Activos', value: data?.resumen.totalProductos ?? 0, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen de tu actividad de facturación</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">{label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
                </div>
                <div className={`${bg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ventas del mes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-slate-500 text-sm font-medium">Ventas del Mes</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{fmt(Number(data?.ventasMes.total ?? 0))}</p>
            <p className="text-slate-400 text-xs mt-1">IGV: {fmt(Number(data?.ventasMes.igv ?? 0))}</p>
            <p className="text-slate-400 text-xs">Comprobantes: {data?.ventasMes.cantidad ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-slate-500 text-sm font-medium">Ventas del Año</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{fmt(Number(data?.ventasAnio.total ?? 0))}</p>
            <p className="text-slate-400 text-xs mt-1">Comprobantes: {data?.ventasAnio.cantidad ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-slate-500 text-sm font-medium">Anulados</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{data?.resumen.comprobantesAnulados ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-800 text-base">Ventas últimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ventas ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip formatter={(v: number) => fmt(Number(v))} />
              <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Últimos comprobantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-800 text-base">Últimos Comprobantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data?.ultimosComprobantes.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant={c.tipo === 'FACTURA' ? 'default' : 'secondary'} className="text-xs">
                    {c.tipo}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{c.serie}-{c.correlativo}</p>
                    <p className="text-xs text-slate-500">{c.cliente}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{fmt(Number(c.total))}</p>
                  <Badge variant={c.estado === 'EMITIDO' ? 'default' : 'destructive'} className="text-xs">
                    {c.estado}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
