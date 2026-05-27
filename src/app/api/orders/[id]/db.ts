// Simple db mock for now - will use Prisma in production
export const prisma = {
  user: {
    findUnique: async () => null,
    findMany: async () => [],
  },
  product: {
    findMany: async () => [],
    findUnique: async () => null,
  },
  order: {
    create: async (opts: any) => opts,
    findUnique: async () => null,
    findMany: async () => [],
    update: async (args?: any) => args,
  },
  $connect: async () => {},
  $disconnect: async () => {},
};
