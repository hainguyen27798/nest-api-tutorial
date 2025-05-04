export type TDbModuleOptions = {
  uri: string;
  dbName: string;
};

export type TDbModuleSyncOptions = {
  useFactory: (...args: any[]) => Promise<TDbModuleOptions> | TDbModuleOptions;
  inject?: any[];
};
