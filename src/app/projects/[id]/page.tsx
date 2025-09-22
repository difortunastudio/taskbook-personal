"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, use } from "react"
import { BookOpen, ArrowLeft, CheckCircle, Circle, Plus, Calendar, Building, User, Edit3, Trash2 } from "lucide-react"

interface Project {
  id: string
  name: string
  description?: string
  company: {
    id: string
    name: string
    color: string
  }
  tasks?: Task[]
  _count?: {
    tasks: number
  }
  createdAt: string
}

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate?: string
  createdAt: string
}

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: ""
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    fetchProject()
  }, [session, status, router, resolvedParams.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
        setTasks(data.tasks || [])
      } else if (response.status === 404) {
        router.push("/projects")
      }
    } catch (error) {
      console.error("Error fetching project:", error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim() || !project) return

    try {
      const response = await fetch(`/api/projects/${project.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate || null
        })
      })

      if (response.ok) {
        const task = await response.json()
        setTasks([task, ...tasks])
        setNewTask({ title: "", description: "", dueDate: "" })
        setShowTaskForm(false)
      }
    } catch (error) {
      console.error("Error creating task:", error)
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
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, completed } : task
        ))
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session || !project) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar y contenido principal, sin header superior */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button 
          onClick={() => router.push("/projects")}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Proyectos
        </button>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: project.company.color }}
                ></div>
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              </div>
              
              {project.description && (
                <p className="text-gray-600 mb-4">{project.description}</p>
              )}

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {project.company.name}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Creado el {new Date(project.createdAt).toLocaleDateString('es-ES')}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
                </div>
              </div>
            </div>

            <button 
              onClick={() => router.push(`/companies/${project.company.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Building className="h-4 w-4 mr-2" />
              Ver Empresa
            </button>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Tareas del Proyecto</h2>
              <button 
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </button>
            </div>
          </div>

          {/* Create Task Form */}
          {showTaskForm && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nueva Tarea</h3>
              <form onSubmit={createTask} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título de la tarea *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Revisar documentación, Llamar cliente..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha límite (opcional)
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detalles adicionales sobre la tarea..."
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskForm(false)
                      setNewTask({ title: "", description: "", dueDate: "" })
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
                    disabled={!newTask.title.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Tarea
                  </button>
                </div>
              </form>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay tareas en este proyecto</h3>
              <p className="text-gray-600 mb-6">Crea tu primera tarea para empezar a trabajar en este proyecto</p>
              <button 
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear primera tarea
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center flex-1">
                      <button
                        onClick={() => toggleTask(task.id, !task.completed)}
                        className="mr-3 p-1"
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {task.dueDate ? (
                            <span className={new Date(task.dueDate) < new Date() && !task.completed ? 'text-red-500' : ''}>
                              Fecha límite: {new Date(task.dueDate).toLocaleDateString('es-ES')}
                            </span>
                          ) : (
                            <span>Sin fecha límite</span>
                          )}
                          <span className="mx-2">•</span>
                          <span>Creado: {new Date(task.createdAt).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
