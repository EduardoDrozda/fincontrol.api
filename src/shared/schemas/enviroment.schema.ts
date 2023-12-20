import * as Joi from 'joi';

export const envVarsSchema = Joi.object({
  APP_PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
});
