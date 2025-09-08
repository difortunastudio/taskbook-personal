"use client"

import { useState } from "react"
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
  const [notes, setNotes] = useState(task.notes || "")
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(task.id, notes)
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
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
            <p className="text-sm text-gray-500">Añade notas, comentarios o actualizaciones sobre esta tarea</p>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Escribe tus notas aquí...

Ejemplos:
• Reunión con cliente a las 3pm
• Pendiente revisar documentos
• Actualizar presupuesto
• Llamar para confirmar detalles"
          />
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
