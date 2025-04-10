import { PrismaClient } from '@prisma/client';

const prismaClientsCache = new Map<string, PrismaClient>();

function getDatabaseUrlForTenant(tenantSlug: string): string {
  // hide env variables
  return `postgresql://root:password@localhost:5432/${tenantSlug}_db`;
}

export function getPrismaClientForTenant(tenantSlug: string): PrismaClient {
  if (prismaClientsCache.has(tenantSlug)) {
    return prismaClientsCache.get(tenantSlug)!;
  }

  const url = getDatabaseUrlForTenant(tenantSlug);
  const client = new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  });

  prismaClientsCache.set(tenantSlug, client);
  return client;
}
