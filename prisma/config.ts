import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL

// Default PrismaClient (will be initialized correctly based on env)
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl || 'file:./dev.db', // Fallback to SQLite if not set
    },
  },
})