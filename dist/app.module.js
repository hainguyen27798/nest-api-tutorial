"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configs_1 = require("./configs");
const database_1 = require("./database");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const app_logger_1 = require("./pkg/app-logger");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configs_1.Configuration.init],
            }),
            database_1.DatabaseModule.registerSync({
                useFactory: async () => {
                    const mongoConfig = configs_1.Configuration.instance.mongo;
                    const password = encodeURIComponent(mongoConfig.password);
                    const uri = `mongodb://${mongoConfig.username}:${password}@${mongoConfig.host}:${mongoConfig.port}/?directConnection=${mongoConfig.directConnection}`;
                    return {
                        uri,
                        dbName: mongoConfig.dbName,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            app_logger_1.AppLoggerModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map