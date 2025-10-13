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
<<<<<<< HEAD
<<<<<<< HEAD
    const showDeleted = searchParams.get('deleted') === 'true'

    // Obtener tareas del usuario (activas o eliminadas según el parámetro)
=======
    const filter = searchParams.get('filter') || 'today'
    const showDeleted = searchParams.get('deleted') === 'true'

    let whereClause: TaskWhereClause = {
      userId: session.user.id,
      deleted: showDeleted ? true : false
    }
>>>>>>> 9db4b72 (feat: implement soft delete and restore functionality for tasks)

    // SOLUCIÓN DEFINITIVA: Si pide eliminadas, filtra por deleted=true. Si no, muestra TODAS.
    const whereCondition = showDeleted 
      ? { userId: session.user.id, deleted: true }
      : { userId: session.user.id }  // SIN filtro de deleted para tareas normales
=======
    const showDeleted = searchParams.get('deleted') === 'true'

    console.log('🔍 API Tasks GET:', { showDeleted, userId: session.user.id })
>>>>>>> 78424b5 (refactor: simplify task retrieval logic and improve filtering for deleted tasks)

    // Consulta simplificada
    const tasks = await prisma.task.findMany({
<<<<<<< HEAD
      where: whereCondition,
=======
      where: {
        userId: session.user.id,
        deleted: showDeleted // true para papelera, false para tareas normales
      },
>>>>>>> 78424b5 (refactor: simplify task retrieval logic and improve filtering for deleted tasks)
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

    console.log('✅ Tareas encontradas:', tasks.length)
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
