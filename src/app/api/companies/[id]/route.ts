import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const company = await prisma.company.findFirst({
      where: {
        id: params.id,
        user: {
          email: session.user.email
        }
      },
      include: {
        _count: {
          select: {
            tasks: true,
            projects: true
          }
        }
      }
    })

    if (!company) {
      return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error("Error fetching company:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, address, cif, accountNumber, password, color, notes } = body

    // Verificar que la empresa pertenece al usuario
    const existingCompany = await prisma.company.findFirst({
      where: {
        id: params.id,
        user: {
          email: session.user.email
        }
      }
    })

    if (!existingCompany) {
      return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 })
    }

    const updatedCompany = await prisma.company.update({
      where: {
        id: params.id
      },
      data: {
        name,
        email,
        phone,
        address,
        cif,
        accountNumber,
        password,
        color,
        notes
      },
      include: {
        _count: {
          select: {
            tasks: true,
            projects: true
          }
        }
      }
    })

    return NextResponse.json(updatedCompany)
  } catch (error) {
    console.error("Error updating company:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que la empresa pertenece al usuario
    const existingCompany = await prisma.company.findFirst({
      where: {
        id: params.id,
        user: {
          email: session.user.email
        }
      }
    })

    if (!existingCompany) {
      return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 })
    }

    await prisma.company.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: "Empresa eliminada correctamente" })
  } catch (error) {
    console.error("Error deleting company:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
