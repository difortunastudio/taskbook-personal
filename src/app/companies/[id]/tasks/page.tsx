"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Plus, CheckSquare, Square, FileText, Calendar } from "lucide-react"
import DifortunaLogo from "@/components/DifortunaLogo"
import TaskNotesModal from "@/components/TaskNotesModal"

interface Company {
  id: string
  name: string
  color: string
}

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
  notes?: string
  project?: {
    id: string
    name: string
  }
}

export default function CompanyTasks() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const companyId = params?.id as string

  const [company, setCompany] = useState<Company | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showNotesModal, setShowNotesModal] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    if (companyId) {
      fetchData()
    }
  }, [session, status, router, companyId])

  const fetchData = async () => {
    try {
      const [companyRes, tasksRes] = await Promise.all([
        fetch(`/api/companies/${companyId}`),
        fetch(`/api/companies/${companyId}/tasks`)
      ])

      if (companyRes.ok) {
        const companyData = await companyRes.json()
        setCompany(companyData)
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskComplete = async (taskId: string, currentCompleted: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentCompleted })
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, completed: updatedTask.completed } : task
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

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Empresa no encontrada</h1>
          <button
            onClick={() => router.push("/companies")}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Volver a empresas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <DifortunaLogo size={32} className="mr-3" />
              <div className="flex items-center">
                <button
                  onClick={() => router.push(`/companies/${companyId}`)}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Tareas de {company.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {taskStats.total} tareas • {taskStats.pending} pendientes • {taskStats.completed} completadas
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push("/today")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva tarea
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setFilter('all')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Todas ({taskStats.total})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pendientes ({taskStats.pending})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completadas ({taskStats.completed})
              </button>
            </nav>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <CheckSquare className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' && 'No hay tareas'}
                {filter === 'pending' && 'No hay tareas pendientes'}
                {filter === 'completed' && 'No hay tareas completadas'}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' && 'Comienza creando tu primera tarea para esta empresa.'}
                {filter === 'pending' && '¡Excelente! Todas las tareas están completadas.'}
                {filter === 'completed' && 'Aún no hay tareas completadas.'}
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => router.push("/today")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Crear primera tarea
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <button
                        onClick={() => toggleTaskComplete(task.id, task.completed)}
                        className="mr-3 mt-1"
                      >
                        {task.completed ? (
                          <CheckSquare className="h-5 w-5 text-green-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(task.createdAt).toLocaleDateString("es-ES")}
                          </span>
                          {task.project && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {task.project.name}
                            </span>
                          )}
                          {task.notes && (
                            <span className="flex items-center text-blue-600">
                              <FileText className="h-4 w-4 mr-1" />
                              Tiene notas
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTask(task)
                        setShowNotesModal(true)
                      }}
                      className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Ver/editar notas"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Notes Modal */}
      {selectedTask && (
        <TaskNotesModal
          isOpen={showNotesModal}
          onClose={() => {
            setShowNotesModal(false)
            setSelectedTask(null)
          }}
          task={selectedTask}
          onSave={handleSaveNotes}
        />
      )}
    </div>
  )
}
