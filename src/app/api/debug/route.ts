import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'DATABASE_URL not set',
      env: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES'))
    })
  }

  // Mask password in the URL
  const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':***@')
  
  return NextResponse.json({ 
    status: 'ok', 
    databaseUrl: maskedUrl,
    hasPrisma: !!process.env.DATABASE_URL
  })
}