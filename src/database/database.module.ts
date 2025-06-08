import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from '@/database/database.service';
import { TDbModuleSyncOptions } from '@/database/types';

@Module({})
export class DatabaseModule {
  static forRootSync(syncOptions: TDbModuleSyncOptions): DynamicModule {
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
          imports: syncOptions.import || [],
          inject: [...(syncOptions.inject || [])],
        }),
      ],
      providers: [DatabaseService],
      exports: [DatabaseModule],
    };
  }
}
