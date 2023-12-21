import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IMail } from '@shared/interfaces';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({ to, subject, template, context }: IMail) {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}
