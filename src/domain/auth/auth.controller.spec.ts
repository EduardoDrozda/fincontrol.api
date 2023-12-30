import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UserService } from '@domain/user';
import { BullModule } from '@nestjs/bull';
import { USER_SERVICE_MOCK } from '@shared/mocks/services';
import { JwtService } from '@nestjs/jwt';
import { HashModule } from '@shared/modules/hash';
import { PrismaModule } from '@shared/modules';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule, HashModule, PrismaModule],
      providers: [
        AuthService,
        JwtService,
        {
          provide: UserService,
          useValue: USER_SERVICE_MOCK,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login user', async () => {
    jest.spyOn(service, 'login').mockReturnValue(null);

    const credential = {
      email: 'email@email.com',
      password: 'password',
    };

    await controller.login(credential);

    expect(service.login).toHaveBeenCalledWith(credential);
  });
});
