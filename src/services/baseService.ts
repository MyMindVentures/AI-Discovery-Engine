import { prisma } from '../lib/db';

export async function withDbFallback<T>(
  dbAction: () => Promise<T>,
  fallbackData: T,
  label: string
): Promise<T> {
  if (!process.env.DATABASE_URL) {
    console.warn(`[${label}] No DATABASE_URL found. Using mock data fallback.`);
    return fallbackData;
  }

  try {
    return await dbAction();
  } catch (error) {
    console.error(`[${label}] Database access failed:`, error);
    console.warn(`[${label}] Falling back to mock data.`);
    return fallbackData;
  }
}
