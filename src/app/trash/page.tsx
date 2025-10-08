"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react"

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

export default function Trash() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    fetchDeletedTasks()
  }, [session, status, router])

  const fetchDeletedTasks = async () => {
    try {
      const response = await fetch("/api/tasks?deleted=true")
      if (response.ok) {
        const tasks = await response.json()
        setDeletedTasks(tasks)
      }
    } catch (error) {
      console.error("Error fetching deleted tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'restore' })
      })

      if (response.ok) {
        setDeletedTasks(deletedTasks.filter(task => task.id !== taskId))
      }
    } catch (error) {
      console.error("Error restoring task:", error)
    }
  }

  const handlePermanentDelete = async (taskId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar permanentemente esta tarea? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permanent: true })
      })

      if (response.ok) {
        setDeletedTasks(deletedTasks.filter(task => task.id !== taskId))
      }
    } catch (error) {
      console.error("Error permanently deleting task:", error)
    }
  }

  const handleEmptyTrash = async () => {
    if (!confirm('¿Estás seguro de que quieres vaciar toda la papelera? Esta acción eliminará permanentemente todas las tareas y no se puede deshacer.')) {
      return
    }

    try {
      const deletePromises = deletedTasks.map(task => 
        fetch(`/api/tasks/${task.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permanent: true })
        })
      )

      await Promise.all(deletePromises)
      setDeletedTasks([])
    } catch (error) {
      console.error("Error emptying trash:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🗑️ Papelera</h1>
              <p className="text-gray-600">
                Tareas eliminadas - Puedes restaurarlas o eliminarlas permanentemente
              </p>
            </div>
            {deletedTasks.length > 0 && (
              <button
                onClick={handleEmptyTrash}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Vaciar Papelera</span>
              </button>
            )}
          </div>
        </div>

        {deletedTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Trash2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Papelera vacía</h3>
            <p className="text-gray-600">No tienes tareas eliminadas</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-amber-600">
                  Las tareas en la papelera se pueden restaurar o eliminar permanentemente
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {deletedTasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 line-through">
                        {task.title}
                      </h4>
                      
                      {task.description && (
                        <p className="text-gray-600 mt-1 text-sm">{task.description}</p>
                      )}

                      <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
                        {task.company && (
                          <div className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-1"
                              style={{ backgroundColor: task.company.color }}
                            ></div>
                            <span>{task.company.name}</span>
                          </div>
                        )}
                        
                        {task.project && (
                          <div className="flex items-center">
                            <span className="text-gray-400">•</span>
                            <span className="ml-1">{task.project.name}</span>
                          </div>
                        )}

                        <div className="flex items-center">
                          <span className="text-gray-400">•</span>
                          <span className="ml-1">
                            Eliminada: {new Date(task.updatedAt).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleRestore(task.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Restaurar tarea"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar permanentemente"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
