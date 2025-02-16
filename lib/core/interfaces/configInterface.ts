/**
 * Configuration interface
 * @description Used for the configuration of the Nyxa application
 */
export interface NyxaConfigInterface {
  /** 
   * Client configuration
   */
  client: {
    /** Hostname for the client */
    host: string; 
    /** Port for the client */
    port: number; 
    /** Is the client secure */
    secure: boolean;
  };
  /**
   * Server configuration
   */
  server: {
    /** Hostname for the server */
    host: string;
    /** Port for the server */
    port: number;
    /** Is the server secure */
    secure: boolean;
    /** Root of the server */
    root: string;
  };
}
