import { NextResponse } from 'next/server'

// Mock admin user
const mockAdmin = {
  id: 'admin',
  email: 'admin@pearltea.com',
  name: '管理員',
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (email === 'admin@pearltea.com' && password === 'admin123') {
      const token = 'mock-jwt-token-' + Date.now()

      return NextResponse.json({
        user: mockAdmin,
        token,
      })
    }

    return NextResponse.json(
      { error: '帳號或密碼錯誤' },
      { status: 401 }
    )
  } catch (error) {
    console.error('錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}