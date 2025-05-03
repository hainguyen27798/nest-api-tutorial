import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { Configuration } from '@/configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Configuration.instance.server.port);
}

bootstrap()
  .then(() => {
    Logger.log(`Server running at: http://localhost:${Configuration.instance.server.port}`);
  })
  .catch((reason) => {
    Logger.error(`Server occurred error: ${reason}`);
  });
