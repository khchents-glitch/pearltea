import { NextResponse } from 'next/server'

// Dynamic import to get getPrisma function
let getPrisma: any

export const dynamic = 'force-dynamic'

async function initPrisma() {
  if (!getPrisma) {
    const dbModule = await import('@/lib/db')
    getPrisma = dbModule.getPrisma
  }
  return getPrisma()
}

export async function GET() {
  try {
    const apiPrisma = await initPrisma()
    if (!apiPrisma) {
      return NextResponse.json([])
    }

    const orders = await apiPrisma.order.findMany({
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
    const apiPrisma = await initPrisma()
    const body = await request.json()
    const { items, customerName, remarks, total } = body

    // Use mock response if DATABASE_URL is not configured
    if (!apiPrisma) {
      const orderId = 'order-' + Date.now()
      const orderNumber = 'ORD' + Date.now().toString().slice(-6)
      return NextResponse.json({ orderId, orderNumber })
    }

    const orderNumber = 'ORD' + Date.now().toString().slice(-6)

    const order = await apiPrisma.order.create({
      data: {
        userId: 'admin',
        orderNumber,
        customerName: customerName || null,
        remarks: remarks || null,
        total: total || 0,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity || 1,
            price: item.price * (item.quantity || 1),
            notes: item.notes || null,
          }))
        }
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}