import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  
  // Skip if no DATABASE_URL or if it's localhost (dev mode)
  if (!connectionString || connectionString.includes('localhost')) {
    console.warn('DATABASE_URL not set or localhost, using mock data')
    return null
  }

  try {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    return null
  }
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma

export default prisma