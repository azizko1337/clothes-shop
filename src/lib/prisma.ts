import { PrismaClient } from '../generated/client/client';

const globalForPrisma = global as unknown as { prismaClient: PrismaClient };

export const prisma =
  globalForPrisma.prismaClient ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaClient = prisma;
