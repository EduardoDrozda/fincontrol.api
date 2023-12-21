import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueuesKeyEnum } from '@shared/enums';
import { MailService } from '@shared/modules';
import { Job } from 'bull';

@Processor(QueuesKeyEnum.USER)
export class UserProcessor {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  @Process(QueuesKeyEnum.CREATED_USER)
  async sendEmail(job: Job) {
    Logger.log('Start send email to user');

    const { email, name } = job.data;

    await this.mailService.sendEmail({
      to: email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        name,
        url: this.configService.get('FRONTEND_URL'),
      },
    });

    Logger.log('End send email to user');
  }
}
