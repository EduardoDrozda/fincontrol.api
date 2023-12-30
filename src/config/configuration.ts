import { ConfigModuleOptions } from '@nestjs/config';
import { envVarsSchema } from '@shared/schemas';

export function configureEnviroments(): ConfigModuleOptions {
  const enviroment = process.env.NODE_ENV;

  switch (enviroment) {
    case 'testing':
      return {
        envFilePath: '.env.testing',
        isGlobal: true,
        validationSchema: envVarsSchema,
      };
    case 'development':
      return {
        envFilePath: '.env.development',
        isGlobal: true,
        validationSchema: envVarsSchema,
      };
    default:
      return {
        ignoreEnvFile: true,
        ignoreEnvVars: true,
        isGlobal: true,
        validationSchema: envVarsSchema,
      };
  }
}
