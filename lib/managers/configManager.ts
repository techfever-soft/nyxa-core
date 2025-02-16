import { NyxaConfigInterface } from "../core/interfaces/configInterface.js";

export class NyxaConfigManager {
  private static instance: NyxaConfigManager;

  /**
   * Default configuration for the Nyxa application
   */
  private config: NyxaConfigInterface = {
    client: {
      host: "localhost",
      port: 8080,
      secure: false,
    },
    server: {
      host: "localhost",
      port: 3000,
      root: "/api",
      secure: false,
    },
  };

  private constructor() {}

  static getInstance(): NyxaConfigManager {
    if (!NyxaConfigManager.instance) {
      NyxaConfigManager.instance = new NyxaConfigManager();
    }
    return NyxaConfigManager.instance;
  }

  /**
   * Set the configuration
   * @param config The configuration to set
   */
  public setConfig(config: Partial<NyxaConfigInterface>): void {
    this.config = {
      ...this.config,
      ...config,
      client: { ...this.config.client, ...config.client },
      server: { ...this.config.server, ...config.server }
    };
  }

  /**
   * Get the configuration
   * @returns The current configuration
   */
  public getConfig(): NyxaConfigInterface {
    return this.config;
  }
}
