'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Trash2, Loader2, RefreshCw } from 'lucide-react'
import type { Cliente } from '@/types'

const schema = z.object({
  tipoDoc: z.enum(['RUC', 'DNI', 'CE', 'PASAPORTE']),
  numDoc: z.string().min(8, 'Mínimo 8 caracteres'),
  razonSocial: z.string().min(3, 'Mínimo 3 caracteres'),
  direccion: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function ClientesPage() {
  const queryClient = useQueryClient()
  const [busqueda, setBusqueda] = useState('')
  const [open, setOpen] = useState(false)
  const [autocompletando, setAutocompletando] = useState(false)

  const { data: clientes, isLoading } = useQuery<Cliente[]>({
    queryKey: ['clientes', busqueda],
    queryFn: () => api.get(`/clientes?busqueda=${busqueda}`).then(r => r.data),
  })

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipoDoc: 'RUC' },
  })

  const watchTipo = watch('tipoDoc')
  const watchNumDoc = watch('numDoc')

  const crearMutation = useMutation({
    mutationFn: (data: FormData) => api.post('/clientes', data).then(r => r.data),
    onSuccess: () => {
      toast.success('Cliente creado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] })
      reset()
      setOpen(false)
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Error al crear cliente'),
  })

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/clientes/${id}`).then(r => r.data),
    onSuccess: () => {
      toast.success('Cliente eliminado')
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] })
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Error al eliminar'),
  })

  const autocompletar = async () => {
    if (!watchNumDoc) return
    setAutocompletando(true)
    try {
      const { data } = await api.get(`/clientes/autocompletar?tipoDoc=${watchTipo}&numDoc=${watchNumDoc}`)
      setValue('razonSocial', data.razonSocial)
      if (data.direccion) setValue('direccion', data.direccion)
      toast.success('Datos completados desde SUNAT/RENIEC')
    } catch {
      toast.error('No se encontró el documento')
    } finally {
      setAutocompletando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona tu cartera de clientes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(d => crearMutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Tipo Documento</Label>
                  <Select defaultValue="RUC" onValueChange={v => setValue('tipoDoc', v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['RUC', 'DNI', 'CE', 'PASAPORTE'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Número</Label>
                  <div className="flex gap-1">
                    <Input {...register('numDoc')} placeholder="20100070970" />
                    <Button type="button" variant="outline" size="sm" onClick={autocompletar} disabled={autocompletando}>
                      {autocompletando ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.numDoc && <p className="text-red-500 text-xs mt-1">{errors.numDoc.message}</p>}
                </div>
              </div>
              <div>
                <Label className="text-xs">Razón Social / Nombre *</Label>
                <Input {...register('razonSocial')} placeholder="Nombre o razón social" />
                {errors.razonSocial && <p className="text-red-500 text-xs mt-1">{errors.razonSocial.message}</p>}
              </div>
              <div>
                <Label className="text-xs">Dirección</Label>
                <Input {...register('direccion')} placeholder="Av. Ejemplo 123, Lima" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input {...register('email')} type="email" placeholder="correo@ejemplo.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label className="text-xs">Teléfono</Label>
                  <Input {...register('telefono')} placeholder="999999999" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={crearMutation.isPending}>
                {crearMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : 'Guardar Cliente'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <Input placeholder="Buscar por nombre o documento..." className="pl-9 max-w-md"
          value={busqueda} onChange={e => setBusqueda(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Razón Social</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">Cargando...</TableCell></TableRow>
              ) : clientes?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">No hay clientes</TableCell></TableRow>
              ) : clientes?.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{c.tipoDoc}</Badge>
                    <span className="ml-2 font-mono text-sm">{c.numDoc}</span>
                  </TableCell>
                  <TableCell className="font-medium">{c.razonSocial}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{c.direccion ?? '—'}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{c.email ?? c.telefono ?? '—'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => eliminarMutation.mutate(c.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
