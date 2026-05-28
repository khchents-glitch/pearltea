import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json([])
    }

    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, customerName, remarks, total } = body

    // Use mock response if DATABASE_URL is not configured
    if (!prisma) {
      const orderId = 'order-' + Date.now()
      const orderNumber = 'ORD' + Date.now().toString().slice(-6)
      return NextResponse.json({ orderId, orderNumber })
    }

    const orderNumber = 'ORD' + Date.now().toString().slice(-6)

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName || null,
        remarks: remarks || null,
        total: total || 0,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            remark: item.option || null,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}