import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { completed, title, description, notes, appendNote } = await request.json()
    const { id: taskId } = await params

    // Verificar que la tarea pertenece al usuario
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: session.user.id
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { message: "Tarea no encontrada" },
        { status: 404 }
      )
    }

    // Preparar las notas finales
    let finalNotes = notes // Para edición completa de notas
    
    // Si es para agregar una nueva nota, combinarla con las existentes
    if (appendNote && appendNote.trim()) {
      const timestamp = new Date().toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
      
      const existingNotes = existingTask.notes || ""
      if (existingNotes) {
        finalNotes = `${existingNotes}\n\n[${timestamp}]\n${appendNote.trim()}`
      } else {
        finalNotes = `[${timestamp}]\n${appendNote.trim()}`
      }
    }

    // Preparar data para actualizar
    const updateData: any = {}
    if (completed !== undefined) updateData.completed = completed
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (finalNotes !== undefined) updateData.notes = finalNotes

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Error actualizando tarea:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { id: taskId } = await params

    // Verificar que la tarea pertenece al usuario
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: session.user.id
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { message: "Tarea no encontrada" },
        { status: 404 }
      )
    }

    await prisma.task.delete({
      where: { id: taskId }
    })

    return NextResponse.json({ message: "Tarea eliminada" })
  } catch (error) {
    console.error("Error eliminando tarea:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
