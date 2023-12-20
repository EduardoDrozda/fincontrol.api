import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { GlobalModule } from '@shared/modules';

@Module({
  imports: [GlobalModule, UserModule],
})
export class AppModule {}
