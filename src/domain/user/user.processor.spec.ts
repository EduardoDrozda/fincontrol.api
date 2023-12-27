import { Test, TestingModule } from '@nestjs/testing';
import { UserProcessor } from './user.processor';
import { ConfigService } from '@nestjs/config';
import { MAIL_SERVICE_MOCK } from '@shared/mocks/services';
import { MailService } from '@shared/modules';

describe('UserProcessor', () => {
  let processor: UserProcessor;
  let configService: ConfigService;

  const mockMailService = MAIL_SERVICE_MOCK;

  const MOCK_MAIL = {
    to: 'email@email.com',
    subject: 'Welcome to Nice App! Confirm your Email',
    template: './confirmation',
    context: {
      name: 'Mock User',
      url: 'http://localhost:3000',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProcessor,
        ConfigService,
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    processor = module.get<UserProcessor>(UserProcessor);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should call sendEmail method', async () => {
    const spy = jest.spyOn(mockMailService, 'sendEmail');
    const spyConfig = jest
      .spyOn(configService, 'get')
      .mockReturnValue(MOCK_MAIL.context.url);

    const job: any = {
      data: {
        email: MOCK_MAIL.to,
        name: MOCK_MAIL.context.name,
      },
    };

    await processor.sendEmail(job);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(MOCK_MAIL);
    expect(spyConfig).toHaveBeenCalledTimes(1);
    expect(spyConfig).toHaveBeenCalledWith('FRONTEND_URL');
  });
});
