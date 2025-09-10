"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Plus, FileText, AlertCircle, Calendar } from "lucide-react"

interface BusinessRecord {
  id: string
  date: string
  title: string
  description: string
  type: string
  reference?: string
  tags?: string
  createdAt: string
  updatedAt: string
}

interface Company {
  id: string
  name: string
  color: string
}

const RECORD_TYPES = [
  { value: 'nota', label: 'Nota', icon: FileText, color: 'bg-blue-100 text-blue-800' },
  { value: 'contable', label: 'Cambio Contable', icon: FileText, color: 'bg-green-100 text-green-800' },
  { value: 'decision', label: 'Decisión', icon: AlertCircle, color: 'bg-purple-100 text-purple-800' }
]

export default function CompanyRecords() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [company, setCompany] = useState<Company | null>(null)
  const [records, setRecords] = useState<BusinessRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    type: 'nota',
    reference: '',
    tags: ''
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchCompanyAndRecords()
  }, [session, status, params.id])

  const fetchCompanyAndRecords = async () => {
    try {
      // Fetch company
      const companyRes = await fetch(`/api/companies/${params.id}`)
      if (companyRes.ok) {
        const companyData = await companyRes.json()
        setCompany(companyData)
      }

      // Fetch records
      const recordsRes = await fetch(`/api/companies/${params.id}/records${filter ? `?type=${filter}` : ''}`)
      if (recordsRes.ok) {
        const recordsData = await recordsRes.json()
        setRecords(recordsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/companies/${params.id}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({
          date: new Date().toISOString().split('T')[0],
          title: '',
          description: '',
          type: 'nota',
          reference: '',
          tags: ''
        })
        fetchCompanyAndRecords()
      } else {
        console.error('Error creating record')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getRecordTypeInfo = (type: string) => {
    return RECORD_TYPES.find(rt => rt.value === type) || RECORD_TYPES[0]
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </button>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Memoria Contable
              </h1>
              <p className="text-slate-600">
                {company?.name} • Anota lo que necesites recordar sobre esta empresa
              </p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nueva Nota
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Todos
            </button>
            {RECORD_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === type.value 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No hay registros aún</p>
              <p className="text-slate-400 text-sm">Crea tu primer registro para comenzar</p>
            </div>
          ) : (
            records.map(record => {
              const typeInfo = getRecordTypeInfo(record.type)
              const Icon = typeInfo.icon
              
              return (
                <div key={record.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{record.title}</h3>
                        <p className="text-sm text-slate-500">
                          {new Date(record.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>

                  <p className="text-slate-700 mb-4 leading-relaxed">
                    {record.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    {record.reference && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Ref:</span>
                        <span>{record.reference}</span>
                      </div>
                    )}
                    {record.tags && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Tags:</span>
                        <span>{record.tags}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Nueva Nota</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tipo
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {RECORD_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ej: Cambio en Holded, Reunión con socios, Decisión importante..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Escribe todo lo que necesites recordar sobre este tema..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Referencia
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ej: Holded, Acta 2025-01, Factura nº123..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ej: importante, urgente, revisar..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Guardar Nota
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
