import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envVarsSchema } from '@shared/schemas';
import { HashService, PrismaService } from '@shared/services';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
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
  ],
  providers: [PrismaService, HashService],
  exports: [PrismaService, HashService],
})
export class GlobalModule {}
