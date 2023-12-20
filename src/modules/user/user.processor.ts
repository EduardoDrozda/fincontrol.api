import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { QueuesKeyEnum } from '@shared/enums';
import { Job } from 'bull';

@Processor(QueuesKeyEnum.USER)
export class UserProcessor {
  @Process(QueuesKeyEnum.CREATED_USER)
  async sendEmail(job: Job<unknown>) {
    Logger.log('Start send email to user');

    Logger.log(job.data);

    Logger.log('Email sent');
  }
}
