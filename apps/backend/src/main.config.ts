import {
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config';
import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
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

const mongooseOptions: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return {
      uri: configService.getOrThrow<string>('DB_CONNECTION'),
      dbName: 'wiki-content',
      appName: 'wiki-backend',
      retryAttempts: 3,
      lazyConnection: false,
    };
  },
  inject: [ConfigService],
};

export const configModule = ConfigModule.forRoot(configOptions);
export const mongooseModule = MongooseModule.forRootAsync(mongooseOptions);
