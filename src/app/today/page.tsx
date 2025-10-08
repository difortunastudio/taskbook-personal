"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { BookOpen, Plus, Calendar, CheckCircle, Circle, Building, FileText, Edit3 } from "lucide-react"
import DifortunaLogo from "@/components/DifortunaLogo"
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
  dueDate?: string
  createdAt: string
  updatedAt: string
}

interface Company {
  id: string
  name: string
  color: string
}

interface Project {
  id: string
  name: string
  company: Company
}

function TodayContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTaskForNotes, setSelectedTaskForNotes] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    companyId: "",
    projectId: "",
    dueDate: ""
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    fetchTasks()
    fetchCompanies()
    fetchProjects()
  }, [session, status, router])

  const fetchTasks = async () => {
    try {
      console.log("🔍 Intentando cargar tareas...")
      const response = await fetch("/api/tasks?filter=all")
      console.log("📡 Respuesta del servidor:", response.status, response.statusText)
      if (response.ok) {
        const data = await response.json()
        console.log("✅ Tareas cargadas:", data.length, "tareas")
        console.log("📋 Datos:", data)
        setTasks(data)
      } else {
        console.error("❌ Error en la respuesta:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("💥 Error fetching tasks:", error)
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

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
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

  const handleSaveNotes = async (taskId: string, newNote: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appendNote: newNote })
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, notes: updatedTask.notes, updatedAt: updatedTask.updatedAt } : task
        ))
      }
    } catch (error) {
      console.error("Error updating task notes:", error)
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          companyId: newTask.companyId || null,
          projectId: newTask.projectId || null,
          dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null
        })
      })

      if (response.ok) {
        const task = await response.json()
        setTasks([task, ...tasks])
        setNewTask({
          title: "",
          description: "",
          companyId: "",
          projectId: "",
          dueDate: ""
        })
        setShowTaskForm(false)
      }
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const filteredProjects = projects.filter(project => 
    newTask.companyId ? project.company.id === newTask.companyId : true
  )

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

  // Debug: mostrar estado actual
  console.log("🎯 Estado actual - Tareas:", tasks.length, "Loading:", loading, "Session:", !!session)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar y contenido principal, sin header superior */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🎯 Mi Día - ACTUALIZADO</h2>
            <p className="text-gray-600">Gestiona TODAS tus tareas (pendientes y completadas)</p>
          </div>
          <button 
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Tarea
          </button>
        </div>

        {/* Create Task Form */}
        {showTaskForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa (opcional)
                  </label>
                  <select
                    value={newTask.companyId}
                    onChange={(e) => setNewTask(prev => ({ ...prev, companyId: e.target.value, projectId: "" }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sin empresa</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proyecto (opcional)
                  </label>
                  <select
                    value={newTask.projectId}
                    onChange={(e) => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!newTask.companyId}
                  >
                    <option value="">Sin proyecto</option>
                    {filteredProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
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
                    setNewTask({
                      title: "",
                      description: "",
                      companyId: "",
                      projectId: "",
                      dueDate: ""
                    })
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

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes tareas</h3>
            <p className="text-gray-600 mb-6">Crea tu primera tarea para empezar a organizarte</p>
            <button 
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Crear mi primera tarea
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tareas pendientes/vencidas */}
            {(() => {
              // Mostrar todas las tareas no completadas, agrupadas por empresa y proyecto
              const pendingTasks = tasks.filter(task => !task.completed)
              console.log("🔍 DEBUG - Total tareas:", tasks.length, "Pendientes:", pendingTasks.length)
              console.log("📋 Tareas:", tasks)
              console.log("⏳ Pendientes:", pendingTasks)
              
              // Debug adicional para tareas completadas
              const completedTasks = tasks.filter(task => task.completed)
              console.log("✅ DEBUG - Tareas completadas:", completedTasks.length, completedTasks)
              
              if (pendingTasks.length > 0) {
                // Agrupar por empresa y proyecto con mejor formato
                const grouped = {} as Record<string, Task[]>
                pendingTasks.forEach(task => {
                  let key = "📝 Tareas personales"
                  if (task.company && task.project) {
                    key = `🏢 ${task.company.name} → 📁 ${task.project.name}`
                  } else if (task.company) {
                    key = `🏢 ${task.company.name}`
                  } else if (task.project) {
                    key = `📁 ${task.project.name}`
                  }
                  if (!grouped[key]) grouped[key] = []
                  grouped[key].push(task)
                })

                // Ordenar grupos alfabéticamente y tareas por fecha de creación (más recientes primero)
                const sortedGroups = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
                sortedGroups.forEach(([, groupTasks]) => {
                  groupTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                })
                return (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold flex items-center text-gray-900">
                        <Circle className="h-5 w-5 mr-2 text-blue-500" />
                        Todas las Tareas Pendientes ({pendingTasks.length})
                      </h3>
                      <p className="text-sm mt-1 text-gray-600">
                        Aquí tienes todas tus tareas pendientes organizadas por empresa y proyecto
                      </p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {sortedGroups.map(([group, groupTasks]) => (
                        <div key={group} className="p-6">
                          <div className="flex items-center mb-4">
                            <h4 className="font-semibold text-gray-800 text-base">{group}</h4>
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {groupTasks.length}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {groupTasks.map(task => (
                              <div key={task.id} className="pl-4 border-l-2 border-gray-200">
                                <TaskItem task={task} toggleTask={toggleTask} setSelectedTaskForNotes={setSelectedTaskForNotes} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              
              // Si no hay tareas pendientes, mostrar mensaje
              return (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <CheckCircle className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    ¡Excelente! No tienes tareas pendientes
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Has completado todas tus tareas. ¿Quieres crear una nueva?
                  </p>
                  <button 
                    onClick={() => setShowTaskForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nueva tarea
                  </button>
                </div>
              )
            })()}

            {/* Tareas completadas */}
            {(() => {
              const completedTasks = tasks.filter(task => task.completed)
              
              if (completedTasks.length > 0) {
                return (
                  <div className="bg-green-50 border border-green-200 rounded-lg shadow-md">
                    <div className="p-6 border-b border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        Tareas Completadas ({completedTasks.length})
                      </h3>
                      <p className="text-sm text-green-600 mt-1">¡Buen trabajo! Estas tareas ya las has terminado</p>
                    </div>
                    <div className="divide-y divide-green-100">
                      {completedTasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="p-4">
                          <TaskItem task={task} toggleTask={toggleTask} setSelectedTaskForNotes={setSelectedTaskForNotes} />
                        </div>
                      ))}
                      {completedTasks.length > 5 && (
                        <div className="p-4 text-center text-green-600 text-sm">
                          Y {completedTasks.length - 5} tareas completadas más...
                        </div>
                      )}
                    </div>
                  </div>
                )
              }
              return null
            })()}
          </div>
        )}
      </main>

      {/* Task Notes Modal */}
      <TaskNotesModal
        isOpen={selectedTaskForNotes !== null}
        onClose={() => setSelectedTaskForNotes(null)}
        task={selectedTaskForNotes || { id: "", title: "", notes: "" }}
        onSave={handleSaveNotes}
      />
    </div>
  )
}

// Componente separado para los items de tarea
function TaskItem({ task, toggleTask, setSelectedTaskForNotes }: {
  task: Task,
  toggleTask: (taskId: string, completed: boolean) => void,
  setSelectedTaskForNotes: (task: Task) => void
}) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <button
            onClick={() => toggleTask(task.id, !task.completed)}
            className="mr-3 mt-1 p-1"
          >
            {task.completed ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            
            {task.description && (
              <p className="text-gray-600 mt-1 text-sm">{task.description}</p>
            )}

            {task.notes && (
              <div className="mt-2 p-2 bg-amber-50 border-l-2 border-amber-200 rounded">
                <p className="text-sm text-amber-800">
                  <FileText className="h-3 w-3 inline mr-1" />
                  {task.notes}
                </p>
              </div>
            )}
            
            <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
              {task.company && (
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: task.company.color }}
                  ></div>
                  <Building className="h-3 w-3 mr-1" />
                  <span>{task.company.name}</span>
                </div>
              )}
              
              {task.project && (
                <div className="flex items-center">
                  <span className="text-gray-400">•</span>
                  <span className="ml-1">{task.project.name}</span>
                </div>
              )}
              
              {task.dueDate && (
                <div className="flex items-center">
                  <span className="text-gray-400">•</span>
                  <Calendar className="h-3 w-3 mr-1 ml-1" />
                  <span>
                    {new Date(task.dueDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}

              <div className="flex items-center">
                <span className="text-gray-400">•</span>
                <span className="ml-1">
                  {new Date(task.updatedAt || task.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setSelectedTaskForNotes(task)}
          className="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Añadir/editar notas"
        >
          <FileText className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function Today() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    }>
      <TodayContent />
    </Suspense>
  )
}
