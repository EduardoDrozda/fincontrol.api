import { MAILER_SERVICE_MOCK } from './../../mocks/services/mail/mail-service.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: MAILER_SERVICE_MOCK,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
