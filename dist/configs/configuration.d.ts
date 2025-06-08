import type { TConfig } from '@/types';
export declare class Configuration {
    private static _config;
    static init(): TConfig;
    static get instance(): TConfig;
}
