'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Search, FileText, Receipt, Loader2 } from 'lucide-react'
import type { Cliente, Producto } from '@/types'

const itemSchema = z.object({
  descripcion: z.string().min(1, 'Requerido'),
  cantidad: z.coerce.number().min(0.001, 'Min 0.001'),
  precioUnitario: z.coerce.number().min(0.01, 'Min 0.01'),
  descuento: z.coerce.number().min(0).default(0),
  afectaIgv: z.boolean().default(true),
  unidad: z.string().default('NIU'),
  productoId: z.string().optional(),
})

const schema = z.object({
  tipoComprobante: z.enum(['FACTURA', 'BOLETA']),
  clienteId: z.string().min(1, 'Selecciona un cliente'),
  empresaId: z.string(),
  moneda: z.string().default('PEN'),
  observaciones: z.string().optional(),
  items: z.array(itemSchema).min(1, 'Agrega al menos un ítem'),
})

type FormData = z.infer<typeof schema>

const IGV = 0.18
const fmt = (n: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(n)

export default function EmisionPage() {
  const queryClient = useQueryClient()
  const [busquedaCliente, setBusquedaCliente] = useState('')
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [comprobanteEmitido, setComprobanteEmitido] = useState<any>(null)

  const { data: empresa } = useQuery({
    queryKey: ['empresa-principal'],
    queryFn: () => api.get('/empresa/principal').then(r => r.data),
  })

  const { data: clientes } = useQuery<Cliente[]>({
    queryKey: ['clientes', busquedaCliente],
    queryFn: () => api.get(`/clientes?busqueda=${busquedaCliente}`).then(r => r.data),
  })

  const { data: productos } = useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: () => api.get('/productos?soloActivos=true').then(r => r.data),
  })

  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoComprobante: 'FACTURA',
      moneda: 'PEN',
      items: [{ descripcion: '', cantidad: 1, precioUnitario: 0, descuento: 0, afectaIgv: true, unidad: 'NIU' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const watchItems = watch('items')
  const watchTipo = watch('tipoComprobante')

  const totales = watchItems.reduce((acc, item) => {
    const subtotal = (item.cantidad || 0) * (item.precioUnitario || 0) - (item.descuento || 0)
    const igv = item.afectaIgv ? subtotal * IGV : 0
    return { subtotal: acc.subtotal + subtotal, igv: acc.igv + igv, total: acc.total + subtotal + igv }
  }, { subtotal: 0, igv: 0, total: 0 })

  const emitirMutation = useMutation({
    mutationFn: (data: FormData) => api.post('/comprobantes', data).then(r => r.data),
    onSuccess: (data) => {
      setComprobanteEmitido(data)
      toast.success(`${data.tipoComprobante} ${data.serie}-${data.correlativo} emitida exitosamente`)
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] })
      reset()
      setClienteSeleccionado(null)
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Error al emitir'),
  })

  const onSubmit = (data: FormData) => {
    if (!empresa) return toast.error('No hay empresa configurada')
    emitirMutation.mutate({ ...data, empresaId: empresa.id })
  }

  const seleccionarProducto = (index: number, productoId: string) => {
    const producto = productos?.find(p => p.id === productoId)
    if (!producto) return
    setValue(`items.${index}.descripcion`, producto.descripcion)
    setValue(`items.${index}.precioUnitario`, Number(producto.precio))
    setValue(`items.${index}.afectaIgv`, producto.igv)
    setValue(`items.${index}.unidad`, producto.unidad)
    setValue(`items.${index}.productoId`, producto.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Emisión de Comprobantes</h1>
        <p className="text-slate-500 text-sm mt-1">Emite facturas y boletas electrónicas</p>
      </div>

      {/* Comprobante emitido exitosamente */}
      {comprobanteEmitido && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">
                    {comprobanteEmitido.tipoComprobante} emitida: {comprobanteEmitido.serie}-{comprobanteEmitido.correlativo}
                  </p>
                  <p className="text-green-600 text-sm">Total: {fmt(Number(comprobanteEmitido.total))}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setComprobanteEmitido(null)}>
                Nueva emisión
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-4">

            {/* Tipo comprobante */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-800">Tipo de Comprobante</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {(['FACTURA', 'BOLETA'] as const).map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setValue('tipoComprobante', tipo)}
                      className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                        watchTipo === tipo
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {tipo === 'FACTURA'
                        ? <FileText className={`w-5 h-5 ${watchTipo === tipo ? 'text-blue-600' : 'text-slate-400'}`} />
                        : <Receipt className={`w-5 h-5 ${watchTipo === tipo ? 'text-blue-600' : 'text-slate-400'}`} />
                      }
                      <div className="text-left">
                        <p className={`font-semibold text-sm ${watchTipo === tipo ? 'text-blue-600' : 'text-slate-700'}`}>
                          {tipo}
                        </p>
                        <p className="text-xs text-slate-400">
                          {tipo === 'FACTURA' ? 'Requiere RUC' : 'DNI o RUC'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cliente */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-800">Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por nombre o documento..."
                    className="pl-9"
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                  />
                </div>
                {busquedaCliente && clientes && clientes.length > 0 && !clienteSeleccionado && (
                  <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                    {clientes.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className="w-full p-3 text-left hover:bg-slate-50 transition-colors"
                        onClick={() => {
                          setClienteSeleccionado(c)
                          setValue('clienteId', c.id)
                          setBusquedaCliente(c.razonSocial)
                        }}
                      >
                        <p className="text-sm font-medium text-slate-800">{c.razonSocial}</p>
                        <p className="text-xs text-slate-500">{c.tipoDoc}: {c.numDoc}</p>
                      </button>
                    ))}
                  </div>
                )}
                {clienteSeleccionado && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-blue-800">{clienteSeleccionado.razonSocial}</p>
                      <p className="text-xs text-blue-600">{clienteSeleccionado.tipoDoc}: {clienteSeleccionado.numDoc}</p>
                      {clienteSeleccionado.direccion && (
                        <p className="text-xs text-blue-500">{clienteSeleccionado.direccion}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setClienteSeleccionado(null); setValue('clienteId', ''); setBusquedaCliente('') }}
                    >
                      Cambiar
                    </Button>
                  </div>
                )}
                {errors.clienteId && <p className="text-red-500 text-xs">{errors.clienteId.message}</p>}
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-slate-800">Productos / Servicios</CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => append({ descripcion: '', cantidad: 1, precioUnitario: 0, descuento: 0, afectaIgv: true, unidad: 'NIU' })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-3 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">Ítem {index + 1}</Badge>
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>

                    {/* Selector de producto */}
                    {productos && productos.length > 0 && (
                      <div>
                        <Label className="text-xs text-slate-500">Producto del catálogo (opcional)</Label>
                        <Select onValueChange={(val) => seleccionarProducto(index, val)}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar producto..." />
                          </SelectTrigger>
                          <SelectContent>
                            {productos.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.codigo} — {p.descripcion} ({fmt(Number(p.precio))})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label className="text-xs text-slate-500">Descripción *</Label>
                      <Input {...register(`items.${index}.descripcion`)} placeholder="Descripción del producto/servicio" className="bg-white" />
                      {errors.items?.[index]?.descripcion && (
                        <p className="text-red-500 text-xs mt-1">{errors.items[index]?.descripcion?.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-slate-500">Cantidad *</Label>
                        <Input {...register(`items.${index}.cantidad`)} type="number" step="0.001" min="0" className="bg-white" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500">Precio Unit. *</Label>
                        <Input {...register(`items.${index}.precioUnitario`)} type="number" step="0.01" min="0" className="bg-white" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500">Descuento</Label>
                        <Input {...register(`items.${index}.descuento`)} type="number" step="0.01" min="0" className="bg-white" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`igv-${index}`}
                        {...register(`items.${index}.afectaIgv`)}
                        className="rounded"
                      />
                      <Label htmlFor={`igv-${index}`} className="text-xs text-slate-600 cursor-pointer">
                        Afecta IGV (18%)
                      </Label>
                    </div>

                    {/* Subtotal del item */}
                    <div className="text-right text-sm text-slate-600">
                      Subtotal: <span className="font-semibold">
                        {fmt(
                          ((watchItems[index]?.cantidad || 0) * (watchItems[index]?.precioUnitario || 0) - (watchItems[index]?.descuento || 0)) *
                          (1 + (watchItems[index]?.afectaIgv ? IGV : 0))
                        )}
                      </span>
                    </div>
                  </div>
                ))}
                {errors.items && typeof errors.items.message === 'string' && (
                  <p className="text-red-500 text-xs">{errors.items.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Observaciones */}
            <Card>
              <CardContent className="pt-4">
                <Label className="text-sm text-slate-600">Observaciones (opcional)</Label>
                <Textarea {...register('observaciones')} placeholder="Observaciones o notas adicionales..." className="mt-2 resize-none" rows={2} />
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha — Resumen */}
          <div className="space-y-4">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-800">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Empresa emisora */}
                {empresa && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Emisor</p>
                    <p className="text-sm font-semibold text-slate-800">{empresa.razonSocial}</p>
                    <p className="text-xs text-slate-500">RUC: {empresa.ruc}</p>
                  </div>
                )}

                <Separator />

                {/* Moneda */}
                <div>
                  <Label className="text-xs text-slate-500">Moneda</Label>
                  <Select defaultValue="PEN" onValueChange={(v) => setValue('moneda', v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PEN">🇵🇪 Soles (PEN)</SelectItem>
                      <SelectItem value="USD">🇺🇸 Dólares (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Totales */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-800">{fmt(totales.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">IGV (18%)</span>
                    <span className="text-slate-800">{fmt(totales.igv)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800">TOTAL</span>
                    <span className="text-blue-600 text-lg">{fmt(totales.total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={emitirMutation.isPending}
                >
                  {emitirMutation.isPending
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Emitiendo...</>
                    : <><FileText className="w-4 h-4 mr-2" />Emitir {watchTipo}</>
                  }
                </Button>

                <p className="text-xs text-slate-400 text-center">
                  El comprobante se emitirá con fecha y hora actual
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
