"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BookOpen, Plus, FileText, Building, Users, CheckCircle, Circle, ArrowRight } from "lucide-react"

interface Project {
  id: string
  name: string
  description?: string
  company: {
    id: string
    name: string
    color: string
  }
  _count: {
    tasks: number
  }
  createdAt: string
}

interface Company {
  id: string
  name: string
  color: string
}

export default function Projects() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [newProject, setNewProject] = useState({
    name: "",
    description: ""
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    fetchProjects()
    fetchCompanies()
  }, [session, status, router])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/companies")
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
      }
    } catch (error) {
      console.error("Error fetching companies:", error)
    }
  }

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name.trim() || !selectedCompanyId) return

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProject.name,
          description: newProject.description,
          companyId: selectedCompanyId
        })
      })

      if (response.ok) {
        const project = await response.json()
        setProjects([project, ...projects])
        setNewProject({ name: "", description: "" })
        setSelectedCompanyId("")
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error("Error creating project:", error)
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

  // Agrupar proyectos por empresa
  const projectsByCompany = projects.reduce((acc, project) => {
    const companyId = project.company.id
    if (!acc[companyId]) {
      acc[companyId] = {
        company: project.company,
        projects: []
      }
    }
    acc[companyId].projects.push(project)
    return acc
  }, {} as Record<string, { company: Company, projects: Project[] }>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => router.push("/home")}>
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">TaskBook</h1>
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
              <button 
                onClick={() => router.push("/companies")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Empresas
              </button>
              <span className="text-sm font-medium text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
                Proyectos
              </span>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Proyectos</h2>
            <p className="text-gray-600">Organiza tu trabajo por proyectos y empresas</p>
          </div>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Proyecto
          </button>
        </div>

        {/* Create Project Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nuevo Proyecto</h3>
            <form onSubmit={createProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Nombre del proyecto *
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Rediseño web, Campaña marketing..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 inline mr-1" />
                    Empresa *
                  </label>
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecciona una empresa</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe brevemente el proyecto..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewProject({ name: "", description: "" })
                    setSelectedCompanyId("")
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
                  disabled={!newProject.name.trim() || !selectedCompanyId}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        {Object.keys(projectsByCompany).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes proyectos registrados</h3>
            <p className="text-gray-600 mb-6">Crea tu primer proyecto para organizar mejor tu trabajo</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Crear mi primer proyecto
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(projectsByCompany).map(({ company, projects: companyProjects }) => (
              <div key={company.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Company Header */}
                <div 
                  className="px-6 py-4 border-l-4"
                  style={{ borderLeftColor: company.color }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: company.color }}
                      ></div>
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <span className="ml-2 text-sm text-gray-500">
                        {companyProjects.length} {companyProjects.length === 1 ? 'proyecto' : 'proyectos'}
                      </span>
                    </div>
                    <button
                      onClick={() => router.push(`/companies/${company.id}`)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    >
                      Ver empresa
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>

                {/* Projects Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyProjects.map((project) => (
                    <div 
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 flex-1">{project.name}</h4>
                        <Users className="h-4 w-4 text-gray-400 ml-2" />
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {project._count.tasks} {project._count.tasks === 1 ? 'tarea' : 'tareas'}
                        </div>
                        <span>
                          {new Date(project.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
