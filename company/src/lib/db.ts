import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/src/generated/prisma/client";

type PrismaGlobal = typeof globalThis & {
  trustLensPrisma?: PrismaClient;
};

const globalForPrisma = globalThis as PrismaGlobal;

function createPrismaClient() {
  const connectionString =
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL belum dikonfigurasi.",
    );
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({
    adapter,
  });
}

export function getDb() {
  if (!globalForPrisma.trustLensPrisma) {
    globalForPrisma.trustLensPrisma =
      createPrismaClient();
  }

  return globalForPrisma.trustLensPrisma;
}