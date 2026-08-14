import { PrismaClient } from "@prisma/client";

/**
 * Instance unique du client Prisma. En développement, le rechargement à
 * chaud recréerait un nouveau client à chaque sauvegarde sans ce cache
 * global — on le stocke donc sur `globalThis`.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
