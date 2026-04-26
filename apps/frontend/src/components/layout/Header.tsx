'use client'
import { useAuthStore } from '@/store/auth.store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function Header() {
  const { usuario } = useAuthStore()

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-800">{usuario?.nombre}</p>
          <Badge variant="secondary" className="text-xs">{usuario?.rol}</Badge>
        </div>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            {usuario?.nombre?.charAt(0) ?? 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
