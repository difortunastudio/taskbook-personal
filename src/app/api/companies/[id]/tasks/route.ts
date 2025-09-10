import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
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

    const tasks = await prisma.task.findMany({
      where: {
        companyId: resolvedParams.id,
        userId: session.user.id
      },
      include: {
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
    console.error("Error fetching company tasks:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
