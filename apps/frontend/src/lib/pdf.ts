import api from './axios'

export async function descargarPdf(id: string, serie: string, correlativo: string) {
  const res = await api.get(`/comprobantes/${id}/pdf`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${serie}-${correlativo}.pdf`
  link.click()
  window.URL.revokeObjectURL(url)
}
