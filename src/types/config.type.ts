export type TServer = {
  port: number;
  enableLogging: boolean;
};

export type TMongo = {
  port: number;
  host: string;
  username: string;
  password: string;
  databaseName: string;
  authSource: string;
  directConnection?: boolean;
};

export type TConfig = {
  server: TServer;
  mongo: TMongo;
};
