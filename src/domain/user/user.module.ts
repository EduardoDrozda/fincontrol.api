import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BullModule } from '@nestjs/bull';
import { QueuesKeyEnum } from '@shared/enums';
import { UserProcessor } from './user.processor';
import { MailModule } from '@shared/modules';
import { HashService, PrismaService } from '@shared/services';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueuesKeyEnum.USER,
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: Number.MAX_SAFE_INTEGER,
      },
    }),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserProcessor, PrismaService, HashService],
  exports: [UserService],
})
export class UserModule {}
