import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface TaskWhereClause {
  userId: string
  deleted?: boolean
  OR?: Array<{
    dueDate?: { gte?: Date; lt?: Date } | null
    createdAt?: { gte?: Date; lt?: Date }
  }>
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const showDeleted = searchParams.get('deleted') === 'true'

    // Obtener tareas del usuario (activas o eliminadas según el parámetro)
<<<<<<< HEAD
=======

    // SOLUCIÓN DEFINITIVA: Si pide eliminadas, filtra por deleted=true. Si no, muestra TODAS.
    const whereCondition = showDeleted 
      ? { userId: session.user.id, deleted: true }
      : { userId: session.user.id }  // SIN filtro de deleted para tareas normales

>>>>>>> b35ae8a (refactor: simplify task retrieval logic by consolidating where condition for deleted tasks)
    const tasks = await prisma.task.findMany({
      where: whereCondition,
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
      },
      orderBy: [
        { completed: "asc" },
        { createdAt: "desc" }
      ]
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error obteniendo tareas:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { title, description, companyId, projectId, dueDate } = await request.json()

    if (!title) {
      return NextResponse.json(
        { message: "El título de la tarea es requerido" },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        companyId: companyId || null,
        projectId: projectId || null,
        userId: session.user.id
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

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Error creando tarea:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
