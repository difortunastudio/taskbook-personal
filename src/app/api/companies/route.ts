import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    console.log("GET Companies - Session:", session) // Debug
    console.log("GET Companies - User ID:", session.user?.id) // Debug

    const companies = await prisma.company.findMany({
      where: { userId: session.user.id },
      include: {
        projects: true,
        _count: {
          select: {
            tasks: true,
            projects: true
          }
        }
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error("Error obteniendo empresas:", error)
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

    console.log("Session:", session) // Debug
    console.log("User ID:", session.user?.id) // Debug

    const { name, email, phone, address, cif, accountNumber, password, notes, color } = await request.json()

    if (!name) {
      return NextResponse.json(
        { message: "El nombre de la empresa es requerido" },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      console.error("Usuario no encontrado:", session.user.id)
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    const company = await prisma.company.create({
      data: {
        name,
        email,
        phone,
        address,
        cif,
        accountNumber,
        password,
        notes,
        color: color || "#3B82F6",
        userId: session.user.id
      }
    })

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error("Error creando empresa:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
