import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

import { ENV_MODE } from '@/constants';
import type { TConfig } from '@/types';

export class Configuration {
  private static _config: TConfig;

  static init(): TConfig {
    let envMode = process.env['NODE_ENV'] as ENV_MODE;

    if (!Object.values(ENV_MODE).includes(envMode)) {
      envMode = ENV_MODE.DEV;
    }

    if (!Configuration._config) {
      Configuration._config = yaml.load(
        readFileSync(join(__dirname, `../../config.${envMode}.yml`), 'utf8'),
      ) as TConfig;
    }

    Configuration._config.server.env = envMode;

    return Configuration._config;
  }

  static get instance(): TConfig {
    return Configuration._config;
  }
}
