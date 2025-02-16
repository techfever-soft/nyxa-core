import { NyxaResponseInterface } from "../core/interfaces/responseInterface.js";
import { NyxaConnectionInterface } from "../core/interfaces/connectionInterface.js";
import { NyxaEventBus } from "../events/eventBus.js";
import { generateResponseId } from "../utils/generateId.js";
import { NyxaResponseStore } from "../store/responseStore.js";
import { NyxaConnectionManager } from "./connectionManager.js";

export class NyxaResponseManager {
  private static instance: NyxaResponseManager;

  private responseStore: NyxaResponseStore;
  private connectionManager: NyxaConnectionManager;

  private responses: NyxaResponseInterface[] = [];

  constructor() {
    this.responseStore = NyxaResponseStore.getInstance();
    this.connectionManager = NyxaConnectionManager.getInstance();

    this.responseStore.getResponses().subscribe((responses) => {
      this.responses = responses;
    })
  }

  public static getInstance(): NyxaResponseManager {
    if (!NyxaResponseManager.instance) {
      NyxaResponseManager.instance = new NyxaResponseManager();
    }
    return NyxaResponseManager.instance;
  }

  /**
   * Add a response to the connection and store
   * @param connection Current connection
   * @param response Response to add
   */
  public addResponse(
    connection: NyxaConnectionInterface,
    response: Partial<NyxaResponseInterface>,
  ): void {
    if (this.responses.some(res => res.id === responseObject.id)) {
      return;
    }

    const responseObject: NyxaResponseInterface = {
      id: response.id || generateResponseId(),
      status: response.status || 0,
      statusText: response.statusText || "Unknown status",
      body: response.body || null,
      headers: response.headers || {},
      responseTime: response.responseTime || 0,
    };

    // Update the connection with the response
    this.connectionManager.updateConnectionResponse(
      connection.id,
      responseObject
    );

    // Adds the response to the store
    this.responseStore.addResponse(responseObject);

    // Emit the response received event
    NyxaEventBus.emit("responseReceived", {
      connection,
      response: responseObject,
    });
  }

  /**
   * Get a response by ID
   * @param responseId Response ID
   * @returns Response object
   */
  public getResponseById(responseId: string): NyxaResponseInterface | undefined {
    return this.responses.find(response => response.id === responseId);
  }

  /**
   * Get all responses
   * @returns All responses
   */
  public getResponses(): NyxaResponseInterface[] {
    return [...this.responses];
  }

}
