import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status ? { status } : undefined

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
            options: true,
          },
        },
        statusHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}