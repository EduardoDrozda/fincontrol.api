export const USER_SERVICE_MOCK = {
  create: jest.fn(),
  verifyIfUserEmailAlreadyExists: jest.fn(),
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  queueUserCreatedEvent: jest.fn(),
  validateUser: jest.fn(),
};
