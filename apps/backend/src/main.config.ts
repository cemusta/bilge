import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

const configOptions: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('local', 'development', 'production')
      .default('development'),
    PORT: Joi.number().default(3000),
    AZURE_ORG: Joi.string().required(),
    AZURE_PROJECT: Joi.string().required(),
    AZURE_DEVOPS_PAT: Joi.string().required(),
  }),
  validationOptions: {
    // allowUnknown: false,
    abortEarly: true,
  },
};

export const configModule = ConfigModule.forRoot(configOptions);
