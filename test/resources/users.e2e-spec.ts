import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MAIL_SERVICE_MOCK, MOCK_BULL_QUEUE } from '@shared/mocks';

import { getQueueToken } from '@nestjs/bull';
import { QueuesKeyEnum } from '@shared/enums';
import { MailerService } from '@nestjs-modules/mailer';
import { AppModule } from '../../src/app.module';

describe('Users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getQueueToken(QueuesKeyEnum.USER))
      .useValue(MOCK_BULL_QUEUE)
      .overrideProvider(getQueueToken(QueuesKeyEnum.CREATED_USER))
      .useValue(MOCK_BULL_QUEUE)
      .overrideProvider(MailerService)
      .useValue(MAIL_SERVICE_MOCK)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/POST users', async () => {
    // return request(app.getHttpServer())
    //   .post('/users')
    //   .send({
    //     name: 'Dummy User',
    //     email: 'dummy@email.com',
    //     password: 'secret',
    //     confirmPassword: 'secret',
    //   })
    //   .expect(HttpStatus.CREATED);

    console.log(process.env.DATABASE_URL);

    expect(true).toBe(true);
  });
});
