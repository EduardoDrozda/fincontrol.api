import { ConfigModuleOptions } from '@nestjs/config';
import { envVarsSchema } from '@shared/schemas';

export function configureEnviroments(): ConfigModuleOptions {
  return {
    envFilePath: '.env',
    isGlobal: true,
    validationSchema: envVarsSchema,
  };
}
