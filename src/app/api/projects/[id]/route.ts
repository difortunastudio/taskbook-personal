import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        id: resolvedParams.id,
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
        tasks: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { name, description } = await request.json()

    const project = await prisma.project.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    const updatedProject = await prisma.project.update({
      where: { id: resolvedParams.id },
      data: {
        name: name || project.name,
        description: description !== undefined ? description : project.description
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    await prisma.project.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: "Proyecto eliminado correctamente" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
