import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL

// For Zeabur PostgreSQL deployment
if (databaseUrl?.startsWith('postgresql://') || databaseUrl?.startsWith('postgres://')) {
  // Direct connection without adapter (Prisma 7)
  export const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })
} else {
  // SQLite fallback (if needed)
  export const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}