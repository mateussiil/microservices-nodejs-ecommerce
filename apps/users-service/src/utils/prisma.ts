import { PrismaClient } from '@prisma/client';

declare global {
  //@ts-ignore
  const prisma: PrismaClient | undefined;
}
//@ts-ignore
// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
const prisma = global.prisma || new PrismaClient();

//@ts-ignore
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
