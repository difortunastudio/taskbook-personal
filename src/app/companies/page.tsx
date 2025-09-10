"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BookOpen, Plus, Building, Mail, Phone, MapPin, FileText } from "lucide-react"
import DifortunaLogo from "@/components/DifortunaLogo"

interface Company {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  cif?: string
  accountNumber?: string
  color: string
  _count: {
    tasks: number
    projects: number
  }
}

export default function Companies() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    fetchCompanies()
  }, [session, status, router])

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/companies")
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
      }
    } catch (error) {
      console.error("Error fetching companies:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => router.push("/home")}>
              <DifortunaLogo className="text-blue-600" size={32} variant="simple" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">TaskBook</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push("/home")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Inicio
              </button>
              <button 
                onClick={() => router.push("/today")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Mi Día
              </button>
              <span className="text-sm font-medium text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
                Empresas
              </span>
              <button 
                onClick={() => router.push("/projects")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Proyectos
              </button>
              <span className="text-sm text-gray-700">Hola, {session.user.name || session.user.email}</span>
              <button 
                onClick={() => router.push("/api/auth/signout")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Empresas</h2>
            <p className="text-gray-600">Gestiona la información de tus empresas y clientes</p>
          </div>
          <button 
            onClick={() => router.push("/companies/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Empresa
          </button>
        </div>

        {/* Companies Grid */}
        {companies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes empresas registradas</h3>
            <p className="text-gray-600 mb-6">Agrega tu primera empresa para empezar a organizar tus tareas</p>
            <button 
              onClick={() => router.push("/companies/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar mi primera empresa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div 
                key={company.id}
                onClick={() => router.push(`/companies/${company.id}`)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4"
                style={{ borderLeftColor: company.color }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: company.color }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  {company.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="truncate">{company.email}</span>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                  {company.address && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="truncate">{company.address}</span>
                    </div>
                  )}
                  {company.cif && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{company.cif}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    {company._count.projects} proyectos
                  </div>
                  <div className="text-sm text-gray-500">
                    {company._count.tasks} tareas
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
