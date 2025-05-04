import { DynamicModule, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from '@/database/database.service';
import { DB_OPTIONS } from '@/database/tokens';
import { TDbModuleSyncOptions } from '@/database/types';

@Global()
@Module({})
export class DatabaseModule {
  static registerSync(syncOptions: TDbModuleSyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async (...args) => {
            const opts = await syncOptions.useFactory(...args);
            return {
              uri: opts.uri,
              dbName: opts.dbName,
              maxPoolSize: 100,
            };
          },
          inject: [...(syncOptions.inject || []), DB_OPTIONS],
        }),
      ],
      providers: [
        {
          provide: DB_OPTIONS,
          useValue: syncOptions,
        },
        DatabaseService,
      ],
      exports: [DatabaseService, DB_OPTIONS],
    };
  }
}
