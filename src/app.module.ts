import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Configuration } from '@/configs';
import { DatabaseModule } from '@/database';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { AppLoggerModule } from '@/pkg/app-logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration.init],
    }),
    DatabaseModule.registerSync({
      useFactory: async () => {
        const mongoConfig = Configuration.instance.mongo;
        const password = encodeURIComponent(mongoConfig.password);
        const uri = `mongodb://${mongoConfig.username}:${password}@${mongoConfig.host}:${mongoConfig.port}/?directConnection=${mongoConfig.directConnection}`;
        return {
          uri,
          dbName: mongoConfig.dbName,
        };
      },
      inject: [ConfigService],
    }),
    AppLoggerModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
