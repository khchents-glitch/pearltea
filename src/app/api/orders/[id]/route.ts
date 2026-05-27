import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, note } = await request.json()

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
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}