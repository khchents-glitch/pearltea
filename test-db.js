// Test database connection for Prisma 7.x
require('dotenv').config({ path: '.env' })

async function testConnection() {
  const { PrismaClient } = require('@prisma/client')

  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:.{2,3}@/, ':****@'))

  try {
    // Try different approaches based on database type
    let prisma
    if (process.env.DATABASE_URL?.startsWith('file:')) {
      // For SQLite - try without datasources config first
      prisma = new PrismaClient()
    } else {
      // For PostgreSQL
      prisma = new PrismaClient()
    }

    await prisma.$connect()
    console.log('✅ Database connected!')

    const userCount = await prisma.user.count()
    console.log(`✅ Query executed! Found ${userCount} users`)

    if (userCount === 0) {
      console.log('\nNo users yet. Run: npx prisma db seed')
    }

    prisma.$disconnect()
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    if (process.env.NODE_ENV === 'test') return
    process.exit(1)
  }
}

testConnection()