import { NyxaClientNodeInterface } from "../core/interfaces/nodeInterface.js";
import { NyxaResponseInterface } from "../core/interfaces/responseInterface.js";
import { NyxaConfigManager } from "./configManager.js";
import { NyxaConnectionInterface } from "../core/interfaces/connectionInterface.js";
import { generateResponseId } from "../utils/generateId.js";
import { NyxaResponseManager } from "./responseManager.js";
import axios from "axios";

export class NyxaRequestManager {
  private static instance: NyxaRequestManager;

  constructor() {
  }

  public static getInstance(): NyxaRequestManager {
    if (!NyxaRequestManager.instance) {
      NyxaRequestManager.instance = new NyxaRequestManager();
    }

    return NyxaRequestManager.instance;
  }

  /**
   * Create a request for a connection
   * @param connection The connection to create the request for
   * @returns The response object
   */
  public async createRequest(connection: NyxaConnectionInterface): Promise<NyxaResponseInterface> {
    const responseManager = NyxaResponseManager.getInstance();
    const config = NyxaConfigManager.getInstance().getConfig();

    if (!config) {
      throw new Error("Config not found");
    }

    const request = (connection.source as NyxaClientNodeInterface).request ||
      (connection.target as NyxaClientNodeInterface).request;

    const { host, port, root, secure } = config.server;

    const startTime = performance.now();

    try {
      const axiosResponse = await axios.request({
        method: request.method,
        url: `${secure ? "https" : "http"}://${host}:${port}${root}${request.endpoint}`,
        headers: request.headers,
        data: request.body,
      });

      const responseTime = performance.now() - startTime;

      const responseObject: NyxaResponseInterface = {
        id: generateResponseId(),
        status: axiosResponse.status,
        statusText: axiosResponse.statusText,
        body: axiosResponse.data,
        headers: axiosResponse.headers,
        responseTime,
      };

      responseManager.addResponse(connection, responseObject);

      return responseObject;
    } catch (e) {
      const error = e as any;
      let status = error.response?.status || 0;
      let statusText = error.message ? error.message : "Unknown Error";

      const responseObject: NyxaResponseInterface = {
        id: generateResponseId(),
        status,
        statusText,
        responseTime: 0,
      };

      responseManager.addResponse(connection, responseObject);

      throw error;
    }
  }
}
