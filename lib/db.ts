import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import os from 'os';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  // If user provided a cloud database URL (e.g., Supabase / Neon / Postgres), use it directly
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // Use OS temporary directory (resolves to /tmp on Vercel/Linux and AppData/Temp on Windows)
  const systemTmpDir = os.tmpdir();
  const tmpDbPath = path.join(systemTmpDir, 'mercury_dev.db');
  
  const cwd = process.cwd();
  const bundledPrismaDb = path.join(cwd, 'prisma', 'dev.db');
  const bundledRootDb = path.join(cwd, 'dev.db');

  // Copy bundled database to writable OS temp folder on serverless cold-start
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
    console.error('Error copying SQLite database to temp directory:', err);
  }

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
