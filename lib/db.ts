import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  // If user provided a cloud database URL (e.g., Supabase / Neon / Postgres), use it directly
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // On Vercel / AWS Lambda serverless functions, the root directory (/var/task) is READ-ONLY.
  // The ONLY writable location is /tmp.
  const tmpDbPath = '/tmp/dev.db';
  const cwd = process.cwd();
  const bundledPrismaDb = path.join(cwd, 'prisma', 'dev.db');
  const bundledRootDb = path.join(cwd, 'dev.db');

  // Copy bundled seed database to /tmp on lambda cold start if not present
  try {
    const shouldCopy = !fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0;
    if (shouldCopy) {
      if (fs.existsSync(bundledPrismaDb) && fs.statSync(bundledPrismaDb).size > 0) {
        fs.copyFileSync(bundledPrismaDb, tmpDbPath);
      } else if (fs.existsSync(bundledRootDb) && fs.statSync(bundledRootDb).size > 0) {
        fs.copyFileSync(bundledRootDb, tmpDbPath);
      }
    }
  } catch (err) {
    console.error('Error copying SQLite database to writable /tmp directory:', err);
  }

  // If /tmp/dev.db exists and is writable, use it. Otherwise fall back.
  let selectedPath = tmpDbPath;
  if (!fs.existsSync(tmpDbPath)) {
    if (fs.existsSync(bundledPrismaDb)) selectedPath = bundledPrismaDb;
    else if (fs.existsSync(bundledRootDb)) selectedPath = bundledRootDb;
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
