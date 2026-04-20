import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
})

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
}

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: ['error'],
    })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db
}