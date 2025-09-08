"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BookOpen, Plus, Calendar, CheckCircle, Circle, Building, FileText, Edit3 } from "lucide-react"
import TaskNotesModal from "@/components/TaskNotesModal"

interface Task {
  id: string
  title: string
  description?: string
  notes?: string
  completed: boolean
  company?: {
    id: string
    name: string
    color: string
  }
  project?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}
  title: string
  description?: string
  completed: boolean
  company?: {
    id: string
    name: string
    color: string
  }
  project?: {
    id: string
    name: string
  }
  dueDate?: string
  createdAt: string
}

interface Company {
  id: string
  name: string
  color: string
  projects: Project[]
}

interface Project {
  id: string
  name: string
  companyId: string
}

export default function Today() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState("")
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    fetchTasks()
    fetchCompanies()
  }, [session, status, router])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
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

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId)
    setSelectedProjectId("") // Reset project when company changes
  }

  const getAvailableProjects = () => {
    const selectedCompany = companies.find(c => c.id === selectedCompanyId)
    return selectedCompany?.projects || []
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const taskData: any = { title: newTask }
      
      if (selectedCompanyId) {
        taskData.companyId = selectedCompanyId
      }
      
      if (selectedProjectId) {
        taskData.projectId = selectedProjectId
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        const task = await response.json()
        setTasks([task, ...tasks])
        setNewTask("")
        setSelectedCompanyId("")
        setSelectedProjectId("")
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
        body: JSON.stringify({ completed: !completed })
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

  const completedTasks = tasks.filter(task => task.completed)
  const pendingTasks = tasks.filter(task => !task.completed)

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
              <span className="text-sm font-medium text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
                Mi Día
              </span>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Mi Día</h2>
          </div>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Add New Task */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {!showTaskForm ? (
            <button
              onClick={() => setShowTaskForm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Plus className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">¿Qué necesitas hacer hoy?</span>
            </button>
          ) : (
            <form onSubmit={addTask} className="space-y-4">
              {/* Task Title */}
              <div>
                <input
                  type="text"
                  placeholder="Título de la tarea"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Company and Project Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 inline mr-1" />
                    Empresa (opcional)
                  </label>
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sin empresa específica</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📁 Proyecto (opcional)
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedCompanyId}
                  >
                    <option value="">Sin proyecto específico</option>
                    {getAvailableProjects().map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {!selectedCompanyId && (
                    <p className="text-xs text-gray-500 mt-1">Selecciona una empresa primero</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskForm(false)
                    setNewTask("")
                    setSelectedCompanyId("")
                    setSelectedProjectId("")
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
                  disabled={!newTask.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar tarea
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Tasks List */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pendientes ({pendingTasks.length})
              </h3>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <button
                      onClick={() => toggleTask(task.id, task.completed)}
                      className="mt-0.5"
                    >
                      <Circle className="h-5 w-5 text-gray-400 hover:text-green-600" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {task.company && (
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: task.company.color }}
                            ></div>
                            <span className="text-sm text-gray-600">{task.company.name}</span>
                          </div>
                        )}
                        {task.project && (
                          <span className="text-sm text-gray-500">• {task.project.name}</span>
                        )}
                      </div>
                      <div className="text-gray-900">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Completadas ({completedTasks.length})
              </h3>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg opacity-75">
                    <button
                      onClick={() => toggleTask(task.id, task.completed)}
                      className="mt-0.5"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {task.company && (
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: task.company.color }}
                            ></div>
                            <span className="text-sm text-gray-600">{task.company.name}</span>
                          </div>
                        )}
                        {task.project && (
                          <span className="text-sm text-gray-500">• {task.project.name}</span>
                        )}
                      </div>
                      <div className="text-gray-900 line-through">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-600 mt-1 line-through">{task.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes tareas para hoy</h3>
              <p className="text-gray-600">Agrega tu primera tarea del día para empezar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
