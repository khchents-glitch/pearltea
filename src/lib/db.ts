// Initialize PrismaClient with error handling for build-time safety
let prisma: any = null

try {
  const { PrismaClient } = require('@prisma/client')
  const { PrismaPg } = require('@prisma/adapter-pg')
  const pg = require('pg')

  // Only try to connect if DATABASE_URL is set and not localhost
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')) {
    try {
      const { Pool } = pg
      const connectionString = process.env.DATABASE_URL
      const pool = new Pool({ connectionString })
      const adapter = new PrismaPg(pool)
      prisma = new PrismaClient({ adapter })
    } catch (error: any) {
      console.warn('Failed to create Prisma client:', error?.message)
    }
  } else if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set, using mock data')
  }
} catch (error: any) {
  console.warn('Prisma not available:', error?.message)
}

// Export either null or initialized Prisma client
export default prisma