import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: '資料庫未設定' }, { status: 500 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: { product: true },
        },
        statusHistory: true,
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
    const { status, note } = await request.json()

    // Use mock response if DATABASE_URL is not configured
    if (!prisma) {
      return NextResponse.json({ 
        id: params.id, 
        status,
        message: 'Mock update successful' 
      })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            note,
          },
        },
      },
      include: {
        items: true,
        statusHistory: true,
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}