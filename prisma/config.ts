import { PrismaClient } from '@prisma/client'

// Prisma 7.x: Use client with default env in module
// DATABASE_URL must be set in environment BEFORE this module loads
export const prisma = new PrismaClient()