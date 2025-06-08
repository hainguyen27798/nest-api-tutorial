import 'winston-daily-rotate-file';
import { LoggerService } from '@nestjs/common/services/logger.service';
import type { Handler } from 'express';
import { ClsService } from 'nestjs-cls';
import type { Logger } from 'winston';
export declare class AppLoggerService implements LoggerService {
    private readonly _Cls;
    private static logger;
    private static morgan;
    static init(): void;
    static get morganMiddleware(): Handler;
    static get Logger(): Logger;
    constructor(_Cls: ClsService);
    log(message: string, context?: string): Logger;
    error(message: string, stack: any, ...optionalParams: any[]): Logger;
    warn(message: any, ...optionalParams: any[]): Logger;
    verbose(message: string): Logger;
    get requestInfo(): {
        userId: any;
        requestId: any;
    };
}
