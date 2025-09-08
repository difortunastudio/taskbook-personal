"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { BookOpen, ArrowLeft, Edit, Save, X, Building, Mail, Phone, MapPin, FileText, Hash, CreditCard, Lock, Plus, CheckSquare, Square } from "lucide-react"

interface Company {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  cif?: string
  accountNumber?: string
  password?: string
  color: string
  notes?: string
  _count: {
    tasks: number
    projects: number
  }
}

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

interface Project {
  id: string
  name: string
  description?: string
  _count: {
    tasks: number
  }
}

export default function CompanyDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const companyId = params?.id as string

  const [company, setCompany] = useState<Company | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCompany, setEditedCompany] = useState<Company | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    if (companyId) {
      fetchCompanyDetails()
    }
  }, [session, status, router, companyId])

  const fetchCompanyDetails = async () => {
    try {
      const [companyRes, tasksRes, projectsRes] = await Promise.all([
        fetch(`/api/companies/${companyId}`),
        fetch(`/api/companies/${companyId}/tasks`),
        fetch(`/api/companies/${companyId}/projects`)
      ])

      if (companyRes.ok) {
        const companyData = await companyRes.json()
        setCompany(companyData)
        setEditedCompany(companyData)
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData)
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData)
      }
    } catch (error) {
      console.error("Error fetching company details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editedCompany) return

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedCompany),
      })

      if (response.ok) {
        const updatedCompany = await response.json()
        setCompany(updatedCompany)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating company:", error)
    }
  }

  const handleCancel = () => {
    setEditedCompany(company)
    setIsEditing(false)
  }

  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      })

      if (response.ok) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, completed: !completed } : task
        ))
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ]

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session || !company) {
    return null
  }

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
                onClick={() => router.push("/companies")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Empresas
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
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.push("/companies")}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a empresas
          </button>
        </div>

        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div 
                className="w-6 h-6 rounded-full mr-4"
                style={{ backgroundColor: company.color }}
              ></div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{company.name}</h2>
                <p className="text-gray-600">{projects.length} proyectos • {tasks.length} tareas</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </button>
              )}
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
              
              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Building className="h-4 w-4 inline mr-1" />
                    Nombre de la empresa
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCompany?.name || ""}
                      onChange={(e) => setEditedCompany(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{company.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email de contacto
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedCompany?.email || ""}
                      onChange={(e) => setEditedCompany(prev => prev ? {...prev, email: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{company.email || "No especificado"}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCompany?.phone || ""}
                      onChange={(e) => setEditedCompany(prev => prev ? {...prev, phone: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{company.phone || "No especificado"}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Dirección fiscal
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCompany?.address || ""}
                      onChange={(e) => setEditedCompany(prev => prev ? {...prev, address: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{company.address || "No especificado"}</p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color identificativo</label>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setEditedCompany(prev => prev ? {...prev, color} : null)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            editedCompany?.color === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: company.color }}
                    ></div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos Adicionales</h3>
              
              <div className="space-y-3">
                {/* CIF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="h-4 w-4 inline mr-1" />
                    CIF/NIF
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCompany?.cif || ""}
                      onChange={(e) => setEditedCompany(prev => prev ? {...prev, cif: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{company.cif || "No especificado"}</p>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <CreditCard className="h-4 w-4 inline mr-1" />
                    Número de cuenta
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCompany?.accountNumber || ""}
                      onChange={(e) => setEditedCompany(prev => prev ? {...prev, accountNumber: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{company.accountNumber || "No especificado"}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Contraseña/Acceso
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCompany?.password || ""}
                      onChange={(e) => setEditedCompany(prev => prev ? {...prev, password: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contraseña o datos de acceso"
                    />
                  ) : (
                    <p className="text-gray-900">{company.password || "No especificado"}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                  {isEditing ? (
                    <textarea
                      value={editedCompany?.notes || ""}
                      onChange={(e) => setEditedCompany(prev => prev ? {...prev, notes: e.target.value} : null)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Información adicional, contactos, etc."
                    />
                  ) : (
                    <p className="text-gray-900">{company.notes || "Sin notas adicionales"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects and Tasks Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tareas Recientes</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm">
                <Plus className="h-4 w-4 inline mr-1" />
                Nueva tarea
              </button>
            </div>
            
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay tareas para esta empresa</p>
            ) : (
              <div className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                    <button
                      onClick={() => toggleTaskComplete(task.id, task.completed)}
                      className="mr-3"
                    >
                      {task.completed ? (
                        <CheckSquare className="h-5 w-5 text-green-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
                {tasks.length > 5 && (
                  <div className="text-center pt-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      Ver todas las tareas ({tasks.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Proyectos</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm">
                <Plus className="h-4 w-4 inline mr-1" />
                Nuevo proyecto
              </button>
            </div>
            
            {projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay proyectos para esta empresa</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">{project._count.tasks} tareas</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
