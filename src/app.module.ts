import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { GlobalModule } from '@shared/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GlobalModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
