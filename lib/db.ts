import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  // If user provided a non-file database URL (e.g. Postgres on Neon/Supabase), use it directly
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // Resolve potential SQLite file locations on Vercel / serverless runtime
  const cwd = process.cwd();
  const prismaDbPath = path.join(cwd, 'prisma', 'dev.db');
  const rootDbPath = path.join(cwd, 'dev.db');
  const tmpDbPath = '/tmp/dev.db';

  let selectedPath = prismaDbPath;

  if (fs.existsSync(prismaDbPath)) {
    selectedPath = prismaDbPath;
  } else if (fs.existsSync(rootDbPath)) {
    selectedPath = rootDbPath;
  } else if (fs.existsSync(tmpDbPath)) {
    selectedPath = tmpDbPath;
  } else {
    // If not found yet, try copying from cwd if possible
    try {
      if (fs.existsSync(prismaDbPath)) {
        fs.copyFileSync(prismaDbPath, tmpDbPath);
        selectedPath = tmpDbPath;
      }
    } catch (e) {
      // fallback
    }
  }

  return `file:${selectedPath}`;
}

const resolvedUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
