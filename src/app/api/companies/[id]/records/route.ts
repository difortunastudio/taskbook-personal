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

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Verificar que la empresa pertenece al usuario
    const company = await prisma.company.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!company) {
      return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 })
    }

    // Construir filtros
    const where = {
      companyId: resolvedParams.id,
      userId: session.user.id,
      ...(type && { type })
    }

    const records = await prisma.businessRecord.findMany({
      where,
      orderBy: {
        date: 'desc'
      },
      take: limit
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error("Error fetching business records:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que la empresa pertenece al usuario
    const company = await prisma.company.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!company) {
      return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 })
    }

    const body = await request.json()
    const {
      date,
      title,
      description,
      type,
      reference,
      tags
    } = body

    if (!date || !title || !description || !type) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: date, title, description, type" },
        { status: 400 }
      )
    }

    const record = await prisma.businessRecord.create({
      data: {
        date: new Date(date),
        title,
        description,
        type,
        reference,
        tags,
        companyId: resolvedParams.id,
        userId: session.user.id
      }
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error("Error creating business record:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
