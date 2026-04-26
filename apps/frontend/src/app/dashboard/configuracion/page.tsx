'use client'
import { useEffect } from 'react'
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
import { Separator } from '@/components/ui/separator'
import { Loader2, Building2 } from 'lucide-react'

const schema = z.object({
  ruc: z.string().length(11, 'El RUC debe tener 11 dígitos'),
  razonSocial: z.string().min(3, 'Requerido'),
  nombreComercial: z.string().optional(),
  direccion: z.string().min(3, 'Requerido'),
  departamento: z.string().optional(),
  provincia: z.string().optional(),
  distrito: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})
type FormData = z.infer<typeof schema>

export default function ConfiguracionPage() {
  const queryClient = useQueryClient()

  const { data: empresa, isLoading } = useQuery({
    queryKey: ['empresa-principal'],
    queryFn: () => api.get('/empresa/principal').then(r => r.data).catch(() => null),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (empresa) reset(empresa)
  }, [empresa, reset])

  const guardarMutation = useMutation({
    mutationFn: (data: FormData) => empresa
      ? api.put(`/empresa/${empresa.id}`, data).then(r => r.data)
      : api.post('/empresa', data).then(r => r.data),
    onSuccess: () => {
      toast.success('Configuración guardada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['empresa-principal'] })
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Error al guardar'),
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configuración de Empresa</h1>
        <p className="text-slate-500 text-sm mt-1">Datos del emisor para los comprobantes electrónicos</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Datos del Emisor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(d => guardarMutation.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-500">RUC *</Label>
                <Input {...register('ruc')} placeholder="20100070970" maxLength={11} />
                {errors.ruc && <p className="text-red-500 text-xs mt-1">{errors.ruc.message}</p>}
              </div>
              <div>
                <Label className="text-xs text-slate-500">Nombre Comercial</Label>
                <Input {...register('nombreComercial')} placeholder="FDev" />
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-500">Razón Social *</Label>
              <Input {...register('razonSocial')} placeholder="FDev Solutions SAC" />
              {errors.razonSocial && <p className="text-red-500 text-xs mt-1">{errors.razonSocial.message}</p>}
            </div>

            <Separator />

            <div>
              <Label className="text-xs text-slate-500">Dirección *</Label>
              <Input {...register('direccion')} placeholder="Av. La Marina 123, San Miguel" />
              {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-slate-500">Departamento</Label>
                <Input {...register('departamento')} placeholder="Lima" />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Provincia</Label>
                <Input {...register('provincia')} placeholder="Lima" />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Distrito</Label>
                <Input {...register('distrito')} placeholder="San Miguel" />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-500">Teléfono</Label>
                <Input {...register('telefono')} placeholder="999999999" />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Email</Label>
                <Input {...register('email')} type="email" placeholder="contacto@empresa.pe" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={guardarMutation.isPending}>
              {guardarMutation.isPending
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</>
                : 'Guardar Configuración'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
