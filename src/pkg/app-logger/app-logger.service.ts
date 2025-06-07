import 'winston-daily-rotate-file';

import { Injectable, Logger as AppLogger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';
import chalk from 'chalk';
import type { Handler } from 'express';
import * as morgan from 'morgan';
import { ClsService } from 'nestjs-cls';
import * as path from 'path';
import { SPLAT } from 'triple-beam';
import type { Logger } from 'winston';
import { createLogger, format, transports } from 'winston';

import { Configuration } from '@/configs';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'cyan',
  verbose: 'blue',
  debug: 'magenta',
  silly: 'white',
};

const colorizes = format.colorize({
  all: true,
});

// log format string
const someColoredFormat = format.printf(
  ({ level, timestamp, message, httpMethod, requestId, userId, method, stack, ...arg }) => {
    const splat = arg[SPLAT] || httpMethod;
    const envMode: string = Configuration.instance.server.env;
    const leadingSpaces = (message as string)?.match(/^\s*/)?.[0];
    const requestInfo = requestId
      ? chalk.cyan(` [requestId(${requestId as string}) - userId(${userId as string})] `)
      : '';
    message = splat
      ? `${chalk.yellow(`[${splat as string}]`)}${requestInfo} ${(message as string)?.trim()}`
      : `${requestInfo}${(message as string)?.trim()}`;
    const env = chalk.magenta(`[${envMode}]`);
    return `${env} ${chalk.grey(timestamp as string)} ${level}: ${method ? colorizes.colorize(level, method as string) : ''}${leadingSpaces}${message as string} ${stack ? (stack as string) : ''}`;
  },
);

const consoleFormat = format.combine(
  format.errors({ stack: true }),
  format.cli({
    colors,
    levels,
  }),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.simple(),
  someColoredFormat,
);

const fileFormat = format.combine(
  format.errors({ stack: true }),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.json(),
  format.printf((payload) => {
    const splat = payload[SPLAT];
    return JSON.stringify({
      env: Configuration.instance.server.env,
      ...payload,
      ...(splat ? { context: splat } : {}),
    });
  }),
);

const errorFormat = format.combine(format.errors({ stack: true }), fileFormat);

const infoFormat = format.combine(
  format((info) => {
    return info.level === 'error' ? false : info;
  })(),
  fileFormat,
);

morgan.token('body', (request) => {
  return request['body'] ? JSON.stringify(request['body']) : '';
});

@Injectable()
export class AppLoggerService implements LoggerService {
  private static logger: Logger;
  private static morgan: Handler;

  static init() {
    // init morgan
    if (!AppLoggerService.morgan) {
      AppLoggerService.morgan = morgan(
        ':method |-| :url :status :res[content-length] - :response-time ms |-| :body',
        {
          stream: {
            write: (message) => AppLogger.verbose(message.trim()),
          },
        },
      );
    }

    // init winston logger
    if (!AppLoggerService.logger) {
      AppLoggerService.logger = createLogger({
        level: 'verbose',
        transports: [
          new transports.DailyRotateFile({
            level: 'error',
            maxSize: 1024 * 1024 * 10,
            dirname: path.join('logs'),
            filename: 'error-%DATE%.log',
            datePattern: 'MM-DD-YYYY',
            format: errorFormat,
          }),
          new transports.DailyRotateFile({
            level: 'debug',
            maxSize: 1024 * 1024 * 10,
            dirname: path.join('logs'),
            filename: 'server-%DATE%.log',
            datePattern: 'MM-DD-YYYY',
            format: infoFormat,
          }),
          new transports.Console({
            format: consoleFormat,
          }),
        ],
      });
    }
  }

  static get morganMiddleware() {
    return AppLoggerService.morgan;
  }

  static get Logger() {
    return AppLoggerService.logger;
  }

  constructor(private readonly _Cls: ClsService) {}

  log(message: string, context?: string) {
    return AppLoggerService.Logger.info({
      message,
      ...this.requestInfo,
      [SPLAT]: context,
    });
  }

  error(message: string, stack: any, ...optionalParams: any[]) {
    return AppLoggerService.Logger.error({
      message,
      stack,
      ...this.requestInfo,
      [SPLAT]: optionalParams,
    });
  }

  warn(message: any, ...optionalParams: any[]) {
    return AppLoggerService.Logger.warn(message, ...optionalParams);
  }

  verbose(message: string) {
    const data = message?.split(' |-| ');
    return AppLoggerService.Logger.http({
      message: data?.[1] || '',
      httpMethod: data?.[0] || '',
      payload: data?.[2] || '',
      ...this.requestInfo,
    });
  }

  get requestInfo() {
    return {
      userId: this._Cls.get('userId'),
      requestId: this._Cls.get('requestId'),
    };
  }
}
