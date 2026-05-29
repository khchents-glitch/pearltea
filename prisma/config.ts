import { PrismaClient } from '@prisma/client'
import { PrismaPGAdapter } from '@prisma/adapter-pg'
import { readFileSync } from 'fs'
import { join } from 'path'

const databaseUrl = process.env.DATABASE_URL

// PostgreSQL adapter for Prisma 7
if (databaseUrl?.startsWith('postgresql://') || databaseUrl?.startsWith('postgres://')) {
  const adapter = new PrismaPGAdapter({
    url: databaseUrl,
  })
  export const prisma = new PrismaClient({ adapter })
} else {
  // SQLite for development (if needed, remove this else branch later)
  export const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}