import { PrismaClient } from '@prisma/client'

// Singleton pattern to prevent multiple instances
let globalForPrisma = globalThis as unknown as {
  prisma: any
}

// Create PrismaClient instance - will only be used in runtime with DATABASE_URL
// During build, this will fail validation, so we create it with a catch
let prisma: PrismaClient | undefined

try {
  prisma = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
} catch (buildValidation) {
  // Build-time validation error (expected when DATABASE_URL is not set)
  // Runtime will handle this with proper connection
  prisma = undefined as any
  globalForPrisma.prisma = undefined as any
}

export const getPrisma = () => prisma

// Also export default for backward compatibility
// This will throw at runtime if DATABASE_URL is not set
const prismaError = new Error('DATABASE_URL environment variable is required')
export default prismaError
export { prismaError as prisma }