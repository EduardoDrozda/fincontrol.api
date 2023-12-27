import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { HashService, PrismaService } from '@shared/services';
import { QueuesKeyEnum } from '@shared/enums';
import { MOCK_BULL_QUEUE } from '@shared/mocks/bull';
import { PRISMA_SERVICE_MOCK } from '@shared/mocks/services';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  const prismaServiceMock = PRISMA_SERVICE_MOCK;
  const MOCK_USER = {
    name: 'Dummy User',
    email: 'dummy@email.com',
    password: 'secret',
    confirmPassword: 'secret',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule],
      providers: [
        UserService,
        HashService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: getQueueToken(QueuesKeyEnum.USER),
          useValue: MOCK_BULL_QUEUE,
        },
        {
          provide: getQueueToken(QueuesKeyEnum.CREATED_USER),
          useValue: MOCK_BULL_QUEUE,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new user', async () => {
    const spyTransactions = jest.spyOn(prismaServiceMock, '$transaction');
    const spyUser = jest
      .spyOn(prismaServiceMock.user, 'create')
      .mockResolvedValue({
        id: '1',
        name: MOCK_USER.name,
        email: MOCK_USER.email,
        password: MOCK_USER.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const spyUserEmailValidation = jest.spyOn(
      prismaServiceMock.userEmailValidation,
      'create',
    );

    await service.create(MOCK_USER);

    expect(spyTransactions).toHaveBeenCalledTimes(1);
    expect(spyUser).toHaveBeenCalledTimes(1);
    expect(spyUserEmailValidation).toHaveBeenCalledTimes(1);
    expect(MOCK_BULL_QUEUE.add).toHaveBeenCalledTimes(1);
  });

  it('should throw error when user already exists', async () => {
    const spyUser = jest
      .spyOn(prismaServiceMock.user, 'findUnique')
      .mockResolvedValue({
        id: '1',
        name: MOCK_USER.name,
        email: MOCK_USER.email,
        password: MOCK_USER.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    await expect(service.create(MOCK_USER)).rejects.toThrow(
      'Email already exists',
    );

    expect(spyUser).toHaveBeenCalledTimes(1);
  });

  it('should catch error when prismaservice throws error', async () => {
    jest.spyOn(prismaServiceMock.user, 'findUnique').mockResolvedValue(null);

    const mockError = new BadRequestException('Prisma Error');
    const spyUser = jest
      .spyOn(prismaServiceMock, '$transaction')
      .mockRejectedValue(mockError);

    await expect(service.create(MOCK_USER)).rejects.toThrow(mockError);

    expect(spyUser).toHaveBeenCalledTimes(1);
  });
});
