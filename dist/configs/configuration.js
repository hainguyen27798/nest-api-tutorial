"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const yaml = require("js-yaml");
const path_1 = require("path");
const constants_1 = require("../constants");
class Configuration {
    static _config;
    static init() {
        let envMode = process.env['NODE_ENV'];
        if (!Object.values(constants_1.ENV_MODE).includes(envMode)) {
            envMode = constants_1.ENV_MODE.DEV;
        }
        if (!Configuration._config) {
            try {
                Configuration._config = yaml.load((0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../../config.${envMode}.yml`), 'utf8'));
                Configuration._config.server.env = envMode;
            }
            catch (error) {
                common_1.Logger.error(`config.${envMode}.yml not found`, error.stack, 'Configuration.init');
                throw error;
            }
        }
        return Configuration._config;
    }
    static get instance() {
        return Configuration._config;
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map