"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_cls_1 = require("nestjs-cls");
const app_logger_service_1 = require("./app-logger.service");
const helpers_1 = require("../helpers");
let AppLoggerModule = class AppLoggerModule {
};
exports.AppLoggerModule = AppLoggerModule;
exports.AppLoggerModule = AppLoggerModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            nestjs_cls_1.ClsModule.forRoot({
                middleware: {
                    mount: true,
                    setup: (cls, req) => {
                        const token = (req.headers?.['x-rtoken'] || req.headers?.['authorization'])?.split('.')?.[1];
                        let userId;
                        try {
                            const decoded = JSON.parse(atob(token));
                            userId = decoded.id;
                        }
                        catch {
                            userId = 'Guest';
                        }
                        cls.set('userId', userId);
                        cls.set('requestId', (0, helpers_1.generateRequestId)());
                    },
                },
            }),
        ],
        providers: [app_logger_service_1.AppLoggerService],
        exports: [app_logger_service_1.AppLoggerService],
    })
], AppLoggerModule);
//# sourceMappingURL=app-logger.module.js.map