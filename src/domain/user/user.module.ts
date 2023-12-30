import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BullModule } from '@nestjs/bull';
import { QueuesKeyEnum } from '@shared/enums';
import { UserProcessor } from './user.processor';
import { HashModule, MailModule, PrismaModule } from '@shared/modules';

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
    HashModule,
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserProcessor],
  exports: [UserService],
})
export class UserModule {}
