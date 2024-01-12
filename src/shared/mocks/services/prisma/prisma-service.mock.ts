export const PRISMA_SERVICE_MOCK = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  userEmailValidation: {
    create: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
  },
  $transaction: jest
    .fn()
    .mockImplementation(async (callback) => callback(PRISMA_SERVICE_MOCK)),
};
