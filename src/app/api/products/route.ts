import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // Use mock data if DATABASE_URL is not configured
    if (!prisma) {
      const mockProducts = [
        { id: '1', name: '經典珍珠奶茶', price: 45, description: '濃郁茶香，Q彈珍珠', categoryId: '1', category: { name: '珍珠奶茶類' } },
        { id: '2', name: '鮮奶菁茶', price: 50, description: '鮮奶搭配菁茶', categoryId: '1', category: { name: '珍珠奶茶類' } },
        { id: '3', name: '可可珍珠奶茶', price: 50, description: '巧克力風味', categoryId: '1', category: { name: '珍珠奶茶類' } },
        { id: '4', name: '芋芋珍珠奶茶', price: 50, description: '香濃芋頭', categoryId: '1', category: { name: '珍珠奶茶類' } },
        { id: '5', name: '檸檬萊姆茶', price: 50, description: '清新檸檬', categoryId: '2', category: { name: '水果茶類' } },
        { id: '6', name: '百香果綠茶', price: 55, description: '酸甜百香果', categoryId: '2', category: { name: '水果茶類' } },
        { id: '7', name: '拿鐵', price: 55, description: '意式濃縮+鮮奶', categoryId: '3', category: { name: '咖啡類' } },
        { id: '8', name: '無骨鳳爪', price: 35, description: '軟嫩的鳳爪', categoryId: '6', category: { name: '小食點心' } },
      ]
      return NextResponse.json(mockProducts)
    }

    const products = await prisma.product.findMany({
      where: { status: 'active' },
      include: { category: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}