"use client"

import { useState, useEffect } from "react"
import { X, Save, FileText } from "lucide-react"

interface TaskNotesModalProps {
  isOpen: boolean
  onClose: () => void
  task: {
    id: string
    title: string
    notes?: string
  }
  onSave: (taskId: string, notes: string) => Promise<void>
}

export default function TaskNotesModal({ isOpen, onClose, task, onSave }: TaskNotesModalProps) {
  const [newNote, setNewNote] = useState("")
  const [saving, setSaving] = useState(false)

  // Limpiar la nueva nota cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setNewNote("")
    }
  }, [isOpen, task.id])

  if (!isOpen) return null

  const handleSave = async () => {
    if (!newNote.trim()) {
      onClose()
      return
    }

    setSaving(true)
    try {
      // Enviar solo la nueva nota, el backend se encarga de agregarla
      await onSave(task.id, newNote.trim())
      onClose()
    } catch (error) {
      console.error("Error saving notes:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Notas de la tarea</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
            <p className="text-sm text-gray-500">Agrega una nueva nota. Las notas anteriores se mantienen al historial.</p>
          </div>

          {/* Notas existentes */}
          {task.notes && (
            <div className="bg-gray-50 rounded-lg p-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas existentes:
              </label>
              <div className="text-sm text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {task.notes}
              </div>
            </div>
          )}

          {/* Nueva nota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva nota:
            </label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Escribe tu nueva nota aquí...

Ejemplos:
• Reunión con cliente a las 3pm
• Pendiente revisar documentos
• Actualizar presupuesto
• Llamar para confirmar detalles"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Notas
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
