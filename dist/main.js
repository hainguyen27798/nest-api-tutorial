"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const configs_1 = require("./configs");
const app_logger_1 = require("./pkg/app-logger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app_logger_1.AppLoggerService.init();
    app.useLogger(app.get(app_logger_1.AppLoggerService));
    app.use(app_logger_1.AppLoggerService.morganMiddleware);
    await app.listen(configs_1.Configuration.instance.server.port);
}
bootstrap()
    .then(() => {
    common_1.Logger.log(`Server running at: http://localhost:${configs_1.Configuration.instance.server.port}`, 'Bootstrap');
})
    .catch((reason) => {
    common_1.Logger.error(`Server occurred error: ${reason.message}`, reason.stack, 'Bootstrap');
});
//# sourceMappingURL=main.js.map