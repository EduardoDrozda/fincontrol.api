import { Module } from '@nestjs/common';
import { UserModule } from '@domain/user';

import { AuthModule } from '@domain/auth';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@shared/guards';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envVarsSchema } from '@shared/schemas';
import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'testing' ? '.env.testing' : '.env',
      isGlobal: true,
      validationSchema: envVarsSchema,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
