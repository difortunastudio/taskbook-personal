"use client"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { BookOpen, Plus, Calendar, CheckCircle, Circle, Building, FileText, Edit3, Trash2 } from "lucide-react"
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
  const searchParams = useSearchParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTaskForNotes, setSelectedTaskForNotes] = useState<Task | null>(null)
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null)
  const [viewFilter, setViewFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    companyId: "",
    projectId: "",
    dueDate: ""
  })

  // Efecto para leer el filtro de la URL
  useEffect(() => {
    const filter = searchParams.get('filter')
    if (filter === 'pending' || filter === 'completed') {
      setViewFilter(filter)
    } else {
      setViewFilter('all')
    }
  }, [searchParams])

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

  const handleEditTask = async (taskId: string, taskData: { title: string, description?: string, companyId?: string, projectId?: string, dueDate?: string }) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(task =>
          task.id === taskId ? updatedTask : task
        ))
        setSelectedTaskForEdit(null)
      }
    } catch (error) {
      console.error("Error editing task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('¿Estás seguro de que quieres mover esta tarea a la papelera?')) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permanent: false })
      })

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId))
      }
    } catch (error) {
      console.error("Error deleting task:", error)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-24 md:pb-8">
      {/* Sidebar y contenido principal, sin header superior */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-8 gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">🎯 Mi Día</h2>
            <p className="text-sm md:text-base text-gray-600">Gestiona tus tareas</p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg items-center min-h-[44px]"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Tarea
          </button>
        </div>

        {/* Create Task Form */}
        {showTaskForm && (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Crear Nueva Tarea</h3>
            <form onSubmit={createTask} className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Título de la tarea *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="Ej: Revisar documentación..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Fecha límite (opcional)
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Empresa (opcional)
                  </label>
                  <select
                    value={newTask.companyId}
                    onChange={(e) => setNewTask(prev => ({ ...prev, companyId: e.target.value, projectId: "" }))}
                    className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Proyecto (opcional)
                  </label>
                  <select
                    value={newTask.projectId}
                    onChange={(e) => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
                    className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="Detalles adicionales..."
                />
              </div>

              <div className="flex gap-2 md:gap-3 justify-end pt-2">
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
                  className="px-4 md:px-4 py-3 md:py-2 text-gray-600 hover:text-gray-800 min-h-[44px] text-base"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-6 py-3 md:py-2 rounded-lg flex items-center min-h-[44px] text-base active:scale-95 transition-transform"
                  disabled={!newTask.title.trim()}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-4 md:mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setViewFilter('all')}
                  className={`flex-1 py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium border-b-2 min-h-[48px] ${viewFilter === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Todas ({tasks.length})
                </button>
                <button
                  onClick={() => setViewFilter('pending')}
                  className={`flex-1 py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium border-b-2 min-h-[48px] ${viewFilter === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Pendientes ({tasks.filter(t => !t.completed).length})
                </button>
                <button
                  onClick={() => setViewFilter('completed')}
                  className={`flex-1 py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium border-b-2 min-h-[48px] ${viewFilter === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Completadas ({tasks.filter(t => t.completed).length})
                </button>
              </nav>
            </div>
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
            {/* Tareas pendientes */}
            {(viewFilter === 'all' || viewFilter === 'pending') && (() => {
              const pendingTasks = tasks.filter(task => !task.completed)

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
                    <div className="p-4 md:p-6 border-b border-gray-200">
                      <h3 className="text-base md:text-lg font-semibold flex items-center text-gray-900">
                        <Circle className="h-5 w-5 mr-2 text-blue-500" />
                        Tareas Pendientes ({pendingTasks.length})
                      </h3>
                      <p className="text-xs md:text-sm mt-1 text-gray-600">
                        Organizadas por empresa y proyecto
                      </p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {sortedGroups.map(([group, groupTasks]) => (
                        <div key={group} className="p-3 md:p-6">
                          <div className="flex items-center mb-3 md:mb-4">
                            <h4 className="font-semibold text-gray-800 text-sm md:text-base">{group}</h4>
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              {groupTasks.length}
                            </span>
                          </div>
                          <div className="space-y-2 md:space-y-3">
                            {groupTasks.map(task => (
                              <div key={task.id} className="pl-2 md:pl-4 border-l-2 border-gray-200">
                                <TaskItem
                                  task={task}
                                  toggleTask={toggleTask}
                                  setSelectedTaskForNotes={setSelectedTaskForNotes}
                                  setSelectedTaskForEdit={setSelectedTaskForEdit}
                                  handleDeleteTask={handleDeleteTask}
                                />
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
              if (viewFilter === 'pending') {
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
              }
              return null
            })()}

            {/* Tareas completadas */}
            {(viewFilter === 'all' || viewFilter === 'completed') && (() => {
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
                      {completedTasks.map((task) => (
                        <div key={task.id} className="p-4">
                          <TaskItem
                            task={task}
                            toggleTask={toggleTask}
                            setSelectedTaskForNotes={setSelectedTaskForNotes}
                            setSelectedTaskForEdit={setSelectedTaskForEdit}
                            handleDeleteTask={handleDeleteTask}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              } else if (viewFilter === 'completed') {
                // Mostrar mensaje cuando no hay tareas completadas pero se está filtrando por completadas
                return (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <CheckCircle className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No hay tareas completadas
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Cuando completes tus tareas aparecerán aquí.
                    </p>
                    <button
                      onClick={() => setViewFilter('all')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center"
                    >
                      Ver todas las tareas
                    </button>
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

      {/* Task Edit Modal */}
      {selectedTaskForEdit && (
        <TaskEditModal
          isOpen={selectedTaskForEdit !== null}
          onClose={() => setSelectedTaskForEdit(null)}
          task={selectedTaskForEdit}
          companies={companies}
          projects={projects}
          onSave={handleEditTask}
        />
      )}

      {/* Floating Tareas Button (FAB) for mobile */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-lg px-6 py-3 flex items-center justify-center font-semibold min-h-[56px] active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6 mr-2" />
          Nueva Tarea
        </button>
      </div>
    </div>
  )
}

// Componente separado para los items de tarea
function TaskItem({ task, toggleTask, setSelectedTaskForNotes, setSelectedTaskForEdit, handleDeleteTask }: {
  task: Task,
  toggleTask: (taskId: string, completed: boolean) => void,
  setSelectedTaskForNotes: (task: Task) => void,
  setSelectedTaskForEdit: (task: Task) => void,
  handleDeleteTask: (taskId: string) => void
}) {
  return (
    <div className="p-3 md:p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start flex-1 min-w-0">
          <button
            onClick={() => toggleTask(task.id, !task.completed)}
            className="mr-2 md:mr-3 mt-0.5 p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 transition-transform"
          >
            {task.completed ? (
              <CheckCircle className="h-6 w-6 md:h-5 md:w-5 text-green-500" />
            ) : (
              <Circle className="h-6 w-6 md:h-5 md:w-5 text-gray-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-sm md:text-base ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h4>

            {task.description && (
              <p className="text-gray-600 mt-1 text-xs md:text-sm">{task.description}</p>
            )}

            {task.notes && (
              <div className="mt-2 p-2 bg-amber-50 border-l-2 border-amber-200 rounded">
                <p className="text-xs md:text-sm text-amber-800">
                  <FileText className="h-3 w-3 inline mr-1" />
                  {task.notes}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center mt-2 gap-x-2 gap-y-1 text-[11px] md:text-xs text-gray-500">
              {task.company && (
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: task.company.color }}
                  ></div>
                  <Building className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[120px]">{task.company.name}</span>
                </div>
              )}

              {task.project && (
                <div className="flex items-center">
                  <span className="text-gray-400">•</span>
                  <span className="ml-1 truncate max-w-[120px]">{task.project.name}</span>
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

        <div className="flex items-center">        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => setSelectedTaskForEdit(task)}
            className="p-2.5 md:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 active:scale-95"
            title="Editar tarea"
          >
            <Edit3 className="h-5 w-5 md:h-4 md:w-4" />
          </button>
          <button
            onClick={() => setSelectedTaskForNotes(task)}
            className="p-2.5 md:p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 active:scale-95"
            title="Añadir/editar notas"
          >
            <FileText className="h-5 w-5 md:h-4 md:w-4" />
          </button>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="p-2.5 md:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 active:scale-95"
            title="Eliminar tarea"
          >
            <Trash2 className="h-5 w-5 md:h-4 md:w-4" />
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}

// Modal para editar tareas
function TaskEditModal({ isOpen, onClose, task, companies, projects, onSave }: {
  isOpen: boolean,
  onClose: () => void,
  task: Task,
  companies: Company[],
  projects: Project[],
  onSave: (taskId: string, taskData: { title: string, description?: string, companyId?: string, projectId?: string, dueDate?: string }) => void
}) {
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    companyId: task.company?.id || '',
    projectId: task.project?.id || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  })

  const filteredProjects = projects.filter(project =>
    !editData.companyId || project.company.id === editData.companyId
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editData.title.trim()) return

    onSave(task.id, {
      title: editData.title.trim(),
      description: editData.description.trim() || undefined,
      companyId: editData.companyId || undefined,
      projectId: editData.projectId || undefined,
      dueDate: editData.dueDate || undefined
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Editar Tarea</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 rounded-lg p-2 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 transition-transform"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <select
                value={editData.companyId}
                onChange={(e) => setEditData({ ...editData, companyId: e.target.value, projectId: '' })}
                className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proyecto
              </label>
              <select
                value={editData.projectId}
                onChange={(e) => setEditData({ ...editData, projectId: e.target.value })}
                className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                disabled={!editData.companyId}
              >
                <option value="">Sin proyecto</option>
                {filteredProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de vencimiento
              </label>
              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>

            <div className="flex justify-end gap-2 md:gap-3 pt-3 md:pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 md:px-4 py-3 md:py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-h-[44px] text-base active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 md:px-4 py-3 md:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all min-h-[44px] text-base active:scale-95"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
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
