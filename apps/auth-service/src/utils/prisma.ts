import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export function exclude<T, Key extends keyof T>(
  data: T,
  keys: Key[]
): Omit<T, Key> {
  for (let key of keys) {
    delete data[key]
  }
  return data
}

export default prisma;