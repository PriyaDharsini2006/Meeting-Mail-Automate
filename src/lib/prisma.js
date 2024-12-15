import { PrismaClient } from '@prisma/client'

const globalForPrisma = global
globalForPrisma.prisma = globalForPrisma.prisma || null
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

