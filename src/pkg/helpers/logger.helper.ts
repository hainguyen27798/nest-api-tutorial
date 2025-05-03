import type { LoggerService } from '@nestjs/common/services/logger.service';
import type { Handler } from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import * as winston from 'winston';

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

const colorizes = winston.format.colorize({
  all: true,
});

// log format string
const someColoredFormat = winston.format.printf(({ level, timestamp, message, method }) => {
  const envMode: string = Configuration.instance.server.env;
  return `[${envMode}] ${timestamp as string} ${level}: ${method ? colorizes.colorize(level, method as string) : ''} ${message as string}`;
});

const format = winston.format.combine(
  winston.format.cli({
    colors,
    levels,
  }),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.simple(),
  someColoredFormat,
);

export class LoggerHelper {
  private static logger: winston.Logger;
  private static morgan: Handler;

  static init() {
    // init morgan
    if (!LoggerHelper.morgan) {
      LoggerHelper.morgan = morgan(
        ':method :url :status :res[content-length] - :response-time ms',
        {
          stream: {
            write: (message) => LoggerHelper.logger.http(message.trim()),
          },
        },
      );
    }

    // init winston logger
    if (!LoggerHelper.logger) {
      LoggerHelper.logger = winston.createLogger({
        level: 'http',
        transports: [
          new winston.transports.Console({
            format,
          }),
          new winston.transports.File({
            maxsize: 1024 * 1024 * 10,
            filename: path.join('logs', 'server.log'),
            format,
          }),
        ],
        exceptionHandlers: [
          new winston.transports.Console({
            format,
          }),
          new winston.transports.File({ filename: path.join('logs', 'error.log'), format }),
        ],
      });
    }
  }

  static get config(): LoggerService {
    return {
      ...LoggerHelper.logger,
      log: (message: unknown) => LoggerHelper.logger.info(message),
      error: (message: unknown) => LoggerHelper.logger.error(message),
    };
  }

  static get morganMiddleware() {
    return LoggerHelper.morgan;
  }
}
