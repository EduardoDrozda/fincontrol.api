import { Module } from '@nestjs/common';
import { UserModule } from '@domain/user';

import { GlobalModule } from '@shared/modules';

@Module({
  imports: [GlobalModule, UserModule],
})
export class AppModule {}
