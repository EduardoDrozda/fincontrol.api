import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { QueuesKeyEnum } from '@shared/enums';
import { MOCK_BULL_QUEUE } from '@shared/mocks/bull';
import { HashService, PrismaService } from '@shared/services';
import { USER_SERVICE_MOCK } from '@shared/mocks/services';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  const userServiceMock = USER_SERVICE_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule],
      providers: [
        PrismaService,
        HashService,
        {
          provide: UserService,
          useValue: userServiceMock,
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
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method', async () => {
    const spy = jest.spyOn(userServiceMock, 'create');

    const user = {
      name: 'Dummy User',
      email: 'dummy@email.com',
      password: 'secret',
      confirmPassword: 'secret',
    };

    await controller.create(user);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
