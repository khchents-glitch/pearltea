import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      where: {
        status: 'active',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}