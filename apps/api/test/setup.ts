import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup before all tests
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Global test timeout
jest.setTimeout(30000);
