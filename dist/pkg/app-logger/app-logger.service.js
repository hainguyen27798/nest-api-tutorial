"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppLoggerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerService = void 0;
require("winston-daily-rotate-file");
const common_1 = require("@nestjs/common");
const chalk_1 = require("chalk");
const morgan = require("morgan");
const nestjs_cls_1 = require("nestjs-cls");
const path = require("path");
const triple_beam_1 = require("triple-beam");
const winston_1 = require("winston");
const configs_1 = require("../../configs");
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
const colorizes = winston_1.format.colorize({
    all: true,
});
const someColoredFormat = winston_1.format.printf(({ level, timestamp, message, httpMethod, requestId, userId, method, stack, ...arg }) => {
    const splat = arg[triple_beam_1.SPLAT] || httpMethod;
    const envMode = configs_1.Configuration.instance.server.env;
    const leadingSpaces = message?.match(/^\s*/)?.[0];
    const requestInfo = requestId
        ? chalk_1.default.cyan(` [requestId(${requestId}) - userId(${userId})] `)
        : '';
    message = splat
        ? `${chalk_1.default.yellow(`[${splat}]`)}${requestInfo} ${message?.trim()}`
        : `${requestInfo}${message?.trim()}`;
    const env = chalk_1.default.magenta(`[${envMode}]`);
    return `${env} ${chalk_1.default.grey(timestamp)} ${level}: ${method ? colorizes.colorize(level, method) : ''}${leadingSpaces}${message} ${stack ? stack : ''}`;
});
const consoleFormat = winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.cli({
    colors,
    levels,
}), winston_1.format.timestamp(), winston_1.format.simple(), someColoredFormat);
const fileFormat = winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.timestamp(), winston_1.format.json(), winston_1.format.printf((payload) => {
    const splat = payload[triple_beam_1.SPLAT];
    return JSON.stringify({
        env: configs_1.Configuration.instance.server.env,
        ...payload,
        ...(splat ? { context: splat } : {}),
    });
}));
const errorFormat = winston_1.format.combine(winston_1.format.errors({ stack: true }), fileFormat);
const infoFormat = winston_1.format.combine((0, winston_1.format)((info) => {
    return info.level === 'error' ? false : info;
})(), fileFormat);
morgan.token('body', (request) => {
    return request['body'] ? JSON.stringify(request['body']) : '';
});
let AppLoggerService = class AppLoggerService {
    static { AppLoggerService_1 = this; }
    _Cls;
    static logger;
    static morgan;
    static init() {
        if (!AppLoggerService_1.morgan) {
            AppLoggerService_1.morgan = morgan(':method |-| :url :status :res[content-length] - :response-time ms |-| :body', {
                stream: {
                    write: (message) => common_1.Logger.verbose(message.trim()),
                },
            });
        }
        if (!AppLoggerService_1.logger) {
            AppLoggerService_1.logger = (0, winston_1.createLogger)({
                level: 'verbose',
                transports: [
                    new winston_1.transports.DailyRotateFile({
                        level: 'error',
                        maxSize: 1024 * 1024 * 10,
                        dirname: path.join('logs'),
                        filename: 'error-%DATE%.log',
                        datePattern: 'MM-DD-YYYY',
                        format: errorFormat,
                    }),
                    new winston_1.transports.DailyRotateFile({
                        level: 'debug',
                        maxSize: 1024 * 1024 * 10,
                        dirname: path.join('logs'),
                        filename: 'server-%DATE%.log',
                        datePattern: 'MM-DD-YYYY',
                        format: infoFormat,
                    }),
                    new winston_1.transports.Console({
                        format: consoleFormat,
                    }),
                ],
            });
        }
    }
    static get morganMiddleware() {
        return AppLoggerService_1.morgan;
    }
    static get Logger() {
        return AppLoggerService_1.logger;
    }
    constructor(_Cls) {
        this._Cls = _Cls;
    }
    log(message, context) {
        return AppLoggerService_1.Logger.info({
            message,
            ...this.requestInfo,
            [triple_beam_1.SPLAT]: context,
        });
    }
    error(message, stack, ...optionalParams) {
        return AppLoggerService_1.Logger.error({
            message,
            stack,
            ...this.requestInfo,
            [triple_beam_1.SPLAT]: optionalParams,
        });
    }
    warn(message, ...optionalParams) {
        return AppLoggerService_1.Logger.warn(message, ...optionalParams);
    }
    verbose(message) {
        const data = message?.split(' |-| ');
        return AppLoggerService_1.Logger.http({
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
};
exports.AppLoggerService = AppLoggerService;
exports.AppLoggerService = AppLoggerService = AppLoggerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_cls_1.ClsService])
], AppLoggerService);
//# sourceMappingURL=app-logger.service.js.map