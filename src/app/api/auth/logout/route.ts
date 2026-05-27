import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'pearl-tea-pos-secret-key-change-in-production'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    try {
      jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json(
        { error: 'Token 無效或已過期' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}