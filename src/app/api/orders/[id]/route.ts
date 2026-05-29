import { NextResponse } from 'next/server'

// Dynamic import of Prisma Client to avoid build-time validation
let prisma: any = undefined

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client')
    prisma = new PrismaClient({})
  }
  return prisma
}

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const apiPrisma = await getPrisma()
    if (!apiPrisma) {
      return NextResponse.json({ error: '資料庫未設定' }, { status: 500 })
    }

    const order = await apiPrisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: '訂單不存在' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const apiPrisma = await getPrisma()
    const { status, note } = await request.json()

    if (!apiPrisma) {
      return NextResponse.json({
        id: params.id,
        status,
        message: 'Mock update successful'
      })
    }

    const updatedOrder = await apiPrisma.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        items: true,
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}