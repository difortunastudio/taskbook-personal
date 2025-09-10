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

    const projects = await prisma.project.findMany({
      where: {
        companyId: resolvedParams.id,
        userId: session.user.id
      },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching company projects:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
