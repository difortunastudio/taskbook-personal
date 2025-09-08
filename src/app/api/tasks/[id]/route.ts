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

    const { completed, title, description, notes } = await request.json()
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

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(completed !== undefined && { completed }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(notes !== undefined && { notes })
      },
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
