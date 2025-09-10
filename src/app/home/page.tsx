"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BookOpen, Plus, CheckSquare, Calendar, CheckCircle, Circle, Building, FolderOpen, Clock, FileText } from "lucide-react"
import TaskNotesModal from "@/components/TaskNotesModal"
import DifortunaLogo from "@/components/DifortunaLogo"

interface Task {
  id: string
  title: string
  description?: string
  notes?: string
  completed: boolean
  dueDate?: string
  createdAt: string
  company?: {
    id: string
    name: string
    color: string
  }
  project?: {
    id: string
    name: string
  }
}

interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  company: {
    id: string
    name: string
    color: string
  }
  _count: {
    tasks: number
  }
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTaskForNotes, setSelectedTaskForNotes] = useState<Task | null>(null)
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalProjects: 0,
    totalCompanies: 0
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    fetchRecentActivity()
  }, [session, status, router])

  const fetchRecentActivity = async () => {
    try {
      // Obtener tareas recientes (todas, no solo de hoy)
      const tasksResponse = await fetch("/api/tasks?filter=all")
      if (tasksResponse.ok) {
        const tasks = await tasksResponse.json()
        setRecentTasks(tasks.slice(0, 5)) // Últimas 5 tareas
        
        // Calcular estadísticas de tareas
        const pendingTasks = tasks.filter((task: Task) => !task.completed).length
        const completedTasks = tasks.filter((task: Task) => task.completed).length
        
        setStats(prev => ({
          ...prev,
          totalTasks: tasks.length,
          pendingTasks,
          completedTasks
        }))
      }

      // Obtener proyectos recientes
      const projectsResponse = await fetch("/api/projects")
      if (projectsResponse.ok) {
        const projects = await projectsResponse.json()
        setRecentProjects(projects.slice(0, 3)) // Últimos 3 proyectos
        
        setStats(prev => ({
          ...prev,
          totalProjects: projects.length
        }))
      }

      // Obtener empresas para estadísticas
      const companiesResponse = await fetch("/api/companies")
      if (companiesResponse.ok) {
        const companies = await companiesResponse.json()
        
        setStats(prev => ({
          ...prev,
          totalCompanies: companies.length
        }))
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed })
      })

      if (response.ok) {
        setRecentTasks(recentTasks.map(task => 
          task.id === taskId ? { ...task, completed } : task
        ))
        
        // Actualizar estadísticas
        setStats(prev => ({
          ...prev,
          pendingTasks: completed ? prev.pendingTasks - 1 : prev.pendingTasks + 1,
          completedTasks: completed ? prev.completedTasks + 1 : prev.completedTasks - 1
        }))
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleSaveNotes = async (taskId: string, newNote: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appendNote: newNote })
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setRecentTasks(recentTasks.map(task => 
          task.id === taskId ? { ...task, notes: updatedTask.notes } : task
        ))
      }
    } catch (error) {
      console.error("Error updating task notes:", error)
    }
  }

  if (status === "loading") {
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
              <span className="text-sm font-medium text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
                Inicio
              </span>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mi Cuaderno Virtual</h2>
          <p className="text-gray-600">Organiza tus tareas y proyectos de manera simple y eficiente</p>
        </div>

        {/* Stats Overview */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <button
              onClick={() => router.push("/today")}
              className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md hover:bg-blue-50 transition-all cursor-pointer"
            >
              <div className="text-2xl font-bold text-blue-600">{stats.pendingTasks}</div>
              <div className="text-xs text-gray-600">Tareas pendientes</div>
            </button>
            <button
              onClick={() => router.push("/today")}
              className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md hover:bg-green-50 transition-all cursor-pointer"
            >
              <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
              <div className="text-xs text-gray-600">Tareas completadas</div>
            </button>
            <button
              onClick={() => router.push("/projects")}
              className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md hover:bg-purple-50 transition-all cursor-pointer"
            >
              <div className="text-2xl font-bold text-purple-600">{stats.totalProjects}</div>
              <div className="text-xs text-gray-600">Proyectos activos</div>
            </button>
            <button
              onClick={() => router.push("/companies")}
              className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md hover:bg-indigo-50 transition-all cursor-pointer"
            >
              <div className="text-2xl font-bold text-indigo-600">{stats.totalCompanies}</div>
              <div className="text-xs text-gray-600">Empresas</div>
            </button>
            <button
              onClick={() => router.push("/today")}
              className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="text-2xl font-bold text-gray-600">{stats.totalTasks}</div>
              <div className="text-xs text-gray-600">Total tareas</div>
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => router.push("/today")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <Calendar className="h-12 w-12 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Mi Día</h3>
                <p className="text-gray-600">Tareas de hoy</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => router.push("/companies")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <CheckSquare className="h-12 w-12 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Empresas</h3>
                <p className="text-gray-600">Gestionar empresas</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => router.push("/projects")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <Plus className="h-12 w-12 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Proyectos</h3>
                <p className="text-gray-600">Ver proyectos</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => router.push("/companies/new")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <Plus className="h-12 w-12 text-indigo-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Nueva Empresa</h3>
                <p className="text-gray-600">Agregar empresa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Actividad Reciente</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => router.push("/today")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Ver todas las tareas
              </button>
              <span className="text-gray-300">•</span>
              <button 
                onClick={() => router.push("/projects")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Ver todos los proyectos
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-2">Cargando actividad...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Tasks */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Tareas Recientes
                </h4>
                {recentTasks.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No hay tareas aún</p>
                    <button 
                      onClick={() => router.push("/today")}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                    >
                      Crear primera tarea
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTasks.map((task) => (
                      <div 
                        key={task.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center flex-1">
                          <button
                            onClick={() => toggleTask(task.id, !task.completed)}
                            className="mr-3 p-1"
                          >
                            {task.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              {task.company && (
                                <>
                                  <div 
                                    className="w-2 h-2 rounded-full mr-1"
                                    style={{ backgroundColor: task.company.color }}
                                  ></div>
                                  <span className="mr-2">{task.company.name}</span>
                                </>
                              )}
                              {task.project && (
                                <>
                                  <FolderOpen className="h-3 w-3 mr-1" />
                                  <span className="mr-2">{task.project.name}</span>
                                </>
                              )}
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{new Date(task.createdAt).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Projects */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2 text-purple-600" />
                  Proyectos Recientes
                </h4>
                {recentProjects.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No hay proyectos aún</p>
                    <button 
                      onClick={() => router.push("/projects")}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                    >
                      Crear primer proyecto
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentProjects.map((project) => (
                      <div 
                        key={project.id}
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-2">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: project.company.color }}
                              ></div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {project.name}
                              </p>
                            </div>
                            {project.description && (
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {project.description}
                              </p>
                            )}
                            <div className="flex items-center text-xs text-gray-500">
                              <Building className="h-3 w-3 mr-1" />
                              <span className="mr-3">{project.company.name}</span>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              <span className="mr-3">{project._count.tasks} tareas</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{new Date(project.createdAt).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
