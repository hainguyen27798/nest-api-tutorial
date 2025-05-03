import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { Configuration } from '@/configs';
import { LoggerHelper } from '@/pkg/helpers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // init logger
  LoggerHelper.init();
  app.useLogger(LoggerHelper.config);

  // apply http logger
  app.use(LoggerHelper.morganMiddleware);

  await app.listen(Configuration.instance.server.port);
}

bootstrap()
  .then(() => {
    Logger.log(`Server running at: http://localhost:${Configuration.instance.server.port}`);
  })
  .catch((reason) => {
    Logger.error(`Server occurred error: ${reason}`);
  });
