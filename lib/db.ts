import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'
// relative path එක පාවිච්චි කිරීම (error එක වළක්වා ගැනීමට)
import { PrismaClient } from '../src/generated/prisma'

// Neon connection එක හරි විදිහට සෙට් කිරීම
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaNeon(pool as any) // Type mismatch එකක් ඇවිත් තියෙන නිසා 'as any' භාවිතා කළා

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