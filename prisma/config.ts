import { PrismaClient } from '@prisma/client'

// For Prisma 7.x, use the generated client and rely on schema's datasource configuration
// The database connection string should be in DATABASE_URL environment variable
export const prisma = new PrismaClient()