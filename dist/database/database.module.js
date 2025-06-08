"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const database_service_1 = require("./database.service");
const tokens_1 = require("./tokens");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static registerSync(syncOptions) {
        return {
            module: DatabaseModule_1,
            imports: [
                mongoose_1.MongooseModule.forRootAsync({
                    useFactory: async (...args) => {
                        const opts = await syncOptions.useFactory(...args);
                        return {
                            uri: opts.uri,
                            dbName: opts.dbName,
                            maxPoolSize: 100,
                        };
                    },
                    inject: [...(syncOptions.inject || []), tokens_1.DB_OPTIONS],
                }),
            ],
            providers: [
                {
                    provide: tokens_1.DB_OPTIONS,
                    useValue: syncOptions,
                },
                database_service_1.DatabaseService,
            ],
            exports: [database_service_1.DatabaseService, tokens_1.DB_OPTIONS],
        };
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], DatabaseModule);
//# sourceMappingURL=database.module.js.map