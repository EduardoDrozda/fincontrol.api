import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JWT_SERVICE_MOCK, USER_SERVICE_MOCK } from '@shared/mocks/services';
import { UserService } from '@domain/user';
import { MOCK_USER } from '@shared/mocks';
import { HashModule } from '@shared/modules';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HashModule],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: JWT_SERVICE_MOCK,
        },
        {
          provide: UserService,
          useValue: USER_SERVICE_MOCK,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login user', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(MOCK_USER as any);
    jest.spyOn(jwtService, 'sign').mockReturnValue('token');

    const credential = {
      email: MOCK_USER.email,
      password: 'secret',
    };

    await service.login(credential);

    expect(userService.findByEmail).toHaveBeenCalledWith(credential.email);
    expect(jwtService.sign).toHaveBeenCalledWith({
      id: MOCK_USER.id,
      email: MOCK_USER.email,
    });
  });

  it('should throw an error when user is not found', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

    const credential = {
      email: MOCK_USER.email,
      password: 'secret',
    };

    await expect(service.login(credential)).rejects.toThrow(
      'E-mail or password is incorrect',
    );

    expect(userService.findByEmail).toHaveBeenCalledWith(credential.email);
  });
});
