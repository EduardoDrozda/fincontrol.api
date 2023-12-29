import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MAIL_SERVICE_MOCK, MOCK_BULL_QUEUE } from '@shared/mocks';

import { AppModule } from '../../src/app.module';
import { getQueueToken } from '@nestjs/bull';
import { QueuesKeyEnum } from '@shared/enums';
import { MailerService } from '@nestjs-modules/mailer';

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
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Dummy User',
        email: 'dummy@email.com',
        password: 'secret',
        confirmPassword: 'secret',
      })
      .expect(HttpStatus.CREATED);
  });
});
