import { Config } from "./config";

type ConfigType = InstanceType<typeof Config>;

export class HttpGateway {
  private config!: ConfigType;

  get = async (path: string) => {
    const response = await fetch(this.config.apiUrl + path);

    return response;
  };

  constructor(config: ConfigType) {
    this.config = config;
  }
}
