import { PrismaClient } from '@prisma/client'
import { config } from './index'                       // 1. on importe config

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.nodeEnv === 'development'              // 2. la condition
      ? ['query', 'error', 'warn']                     // 3. si dev : tout
      : ['error', 'warn'],                             // 4. sinon (prod) : seulement les problèmes
  })

if (config.nodeEnv !== 'production') {                 // 5. même source pour tout le fichier
  globalForPrisma.prisma = prisma
}