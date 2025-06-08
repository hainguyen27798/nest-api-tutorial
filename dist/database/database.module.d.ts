import { DynamicModule } from '@nestjs/common';
import { TDbModuleSyncOptions } from '@/database/types';
export declare class DatabaseModule {
    static registerSync(syncOptions: TDbModuleSyncOptions): DynamicModule;
}
