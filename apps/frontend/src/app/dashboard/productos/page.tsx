'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, Plus, Trash2, Loader2 } from 'lucide-react'
import type { Producto } from '@/types'

const schema = z.object({
  codigo: z.string().min(1, 'Requerido'),
  descripcion: z.string().min(3, 'Mínimo 3 caracteres'),
  unidad: z.string().default('NIU'),
  precio: z.coerce.number().min(0.01, 'Precio inválido'),
  igv: z.boolean().default(true),
})
type FormData = z.infer<typeof schema>

const fmt = (n: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(n)

export default function ProductosPage() {
  const queryClient = useQueryClient()
  const [busqueda, setBusqueda] = useState('')
  const [open, setOpen] = useState(false)

  const { data: productos, isLoading } = useQuery<Producto[]>({
    queryKey: ['productos-admin', busqueda],
    queryFn: () => api.get(`/productos?busqueda=${busqueda}`).then(r => r.data),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { unidad: 'NIU', igv: true },
  })

  const crearMutation = useMutation({
    mutationFn: (data: FormData) => api.post('/productos', data).then(r => r.data),
    onSuccess: () => {
      toast.success('Producto creado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] })
      reset()
      setOpen(false)
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Error al crear producto'),
  })

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/productos/${id}`).then(r => r.data),
    onSuccess: () => {
      toast.success('Producto eliminado')
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] })
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Error al eliminar'),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Productos y Servicios</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona tu catálogo de productos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Producto / Servicio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(d => crearMutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Código *</Label>
                  <Input {...register('codigo')} placeholder="SERV-001" />
                  {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo.message}</p>}
                </div>
                <div>
                  <Label className="text-xs">Unidad</Label>
                  <Input {...register('unidad')} placeholder="NIU / ZZ" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Descripción *</Label>
                <Input {...register('descripcion')} placeholder="Descripción del producto o servicio" />
                {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
              </div>
              <div>
                <Label className="text-xs">Precio (sin IGV) *</Label>
                <Input {...register('precio')} type="number" step="0.01" min="0" placeholder="0.00" />
                {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio.message}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="igv" {...register('igv')} defaultChecked className="rounded" />
                <Label htmlFor="igv" className="text-sm cursor-pointer">Afecta IGV (18%)</Label>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={crearMutation.isPending}>
                {crearMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : 'Guardar Producto'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <Input placeholder="Buscar por código o descripción..." className="pl-9 max-w-md"
          value={busqueda} onChange={e => setBusqueda(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead>IGV</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-400">Cargando...</TableCell></TableRow>
              ) : productos?.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-400">No hay productos</TableCell></TableRow>
              ) : productos?.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm font-medium">{p.codigo}</TableCell>
                  <TableCell>{p.descripcion}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{p.unidad}</Badge></TableCell>
                  <TableCell className="text-right font-semibold">{fmt(Number(p.precio))}</TableCell>
                  <TableCell>
                    {p.igv
                      ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">18%</Badge>
                      : <Badge variant="outline" className="text-xs">Exonerado</Badge>}
                  </TableCell>
                  <TableCell>
                    {p.activo
                      ? <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">Activo</Badge>
                      : <Badge variant="secondary" className="text-xs">Inactivo</Badge>}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => eliminarMutation.mutate(p.id)}>
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
