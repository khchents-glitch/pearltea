import { NextResponse } from 'next/server'

// Mock orders
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const orderId = 'order-' + Date.now()
    const orderNumber = 'ORD' + Date.now().toString().slice(-6)

    return NextResponse.json({
      orderId,
      orderNumber,
    })
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}