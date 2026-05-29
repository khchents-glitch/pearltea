import { NextResponse } from 'next/server'

// Mock JWT verification (temporary - will use real JWT in production)
const MOCK_TOKEN_PREFIX = 'mock-jwt-token-'

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

    // Check if token starts with mock prefix (acceptable since we're using mock auth for now)
    if (!token.startsWith(MOCK_TOKEN_PREFIX)) {
      return NextResponse.json(
        { error: '無效的 Token' },
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