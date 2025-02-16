import { NyxaConnectionInterface } from "../core/interfaces/connectionInterface.js";
import { NyxaEventBus } from "../events/eventBus.js";
import { NyxaClientNodeInterface, NyxaNodeInterface } from "../core/interfaces/nodeInterface.js";
import { NyxaRequestInterface } from "../core/interfaces/requestInterface.js";
import { NyxaResponseInterface } from "../core/interfaces/responseInterface.js";
import { generateConnectionId } from "../utils/generateId.js";
import { NyxaConnectionStore } from "../store/connectionStore.js";
import { NyxaRequestManager } from "./requestManager.js";
import Konva from "konva";

export class NyxaConnectionManager {
  private static instance: NyxaConnectionManager;

  private connectionStore: NyxaConnectionStore;
  private requestManager: NyxaRequestManager;

  private connections: NyxaConnectionInterface[] = [];

  constructor() {
    this.connectionStore = NyxaConnectionStore.getInstance();
    this.requestManager = NyxaRequestManager.getInstance();

    this.connectionStore.getConnections().subscribe((connections) => {
      this.connections = connections;
    });
  }

  static getInstance(): NyxaConnectionManager {
    if (!NyxaConnectionManager.instance) {
      NyxaConnectionManager.instance = new NyxaConnectionManager();
    }
    return NyxaConnectionManager.instance;
  }

  /**
   * Create a connection between two nodes
   * @param source Source node
   * @param target Target node
   * @param line Line to draw
   * @param arrow Arrow to draw
   */
  public async createConnection(
    source: NyxaNodeInterface,
    target: NyxaNodeInterface,
    line?: Konva.Line,
    arrow?: Konva.RegularPolygon,
  ): Promise<NyxaConnectionInterface> {
    return new Promise(async (resolve, reject) => {
      // Verifies if a connection already exists between two nodes
      const existingConnection = this.getConnectionBetween(source, target);

      if (existingConnection) {
        throw new Error(
          `A connection already exists between ${source.id} and ${target.id}`,
        );
      }

      const targetRequest = (target as NyxaClientNodeInterface).request;
      const sourceRequest = (source as NyxaClientNodeInterface).request;
      const request = sourceRequest ? sourceRequest : targetRequest;

      // Creates a new connection object
      const newConnection: NyxaConnectionInterface = {
        id: generateConnectionId(),
        source,
        target,
        draw: {
          line,
          arrow,
        },
        status: "PENDING",
        request: request,
        response: undefined,
      };

      // Adds the connection to the store
      this.connectionStore.addConnection(newConnection);

      // Updates the connectors
      if (source.connectors && source.connectors.length) {
        source.connectors.forEach((connector) => {
          connector.connectedTo = target.id;
        });
      }
      if (target.connectors && target.connectors.length) {
        target.connectors.forEach((connector) => {
          connector.connectedTo = source.id;
        });
      }

      try {
        // Sends the request and waits for the response
        const response = await this.requestManager.createRequest(newConnection);

        // Updates the connection status
        this.updateConnectionStatus(
          newConnection.id,
          "COMPLETED",
          newConnection.request,
          response,
        );

        // Emits a connection created event
        NyxaEventBus.emit("connectionCreated", newConnection);

        resolve(newConnection);
      } catch (e) {
        console.error(`Failed to create connection: ${e}`);

        // Updates the connection status
        this.updateConnectionStatus(newConnection.id, "FAILED");

        reject(e);
      }
    });
  }

  /**
   * Verifies if a connection exists between two nodes
   * @param source Source node
   * @param target Target node
   */
  public getConnectionBetween(
    source: NyxaNodeInterface,
    target: NyxaNodeInterface,
  ): NyxaConnectionInterface | undefined {
    return [...this.connections.values()].find(
      (conn) => conn.source.id === source.id && conn.target.id === target.id,
    );
  }

  /**
   * Deletes a connection by its ID
   * @param connectionId Connection ID
   */
  public removeConnection(connectionId: string): boolean {
    const connection = this.getConnectionByConnector(connectionId);

    if (!connection) {
      throw new Error(`Connexion ${connectionId} introuvable.`);
    }

    // Deletes the connection from the store
    this.connectionStore.removeConnection(connection);

    // Emits a connection cancelled event
    NyxaEventBus.emit("connectionCancelled", connection);

    return true;
  }

  /**
   * Returns a connection by its ID
   * @param connectionId Connection ID
   */
  public getConnectionById(connectionId: string): NyxaConnectionInterface | undefined {
    return this.connections.find((conn) => conn.id === connectionId);
  }

  /**
   * Returns a connection by its ID
   * @param connectionId Connection ID
   */
  public getConnectionByConnector(connectorId: string): NyxaConnectionInterface | undefined {
    return this.connections.find(
      (conn) =>
        conn.source.connectors?.some(connector => connector.id === connectorId) ||
        conn.target.connectors?.some(connector => connector.id === connectorId)
    );
  }

  /**
   * Updates the connection request
   * @param connectionId Connection ID
   * @param response Response object
   */
  public updateConnectionResponse(
    connectionId: string,
    response: NyxaResponseInterface
  ) {
    const connection = this.connections.find(
      (conn) => conn.id === connectionId,
    );

    if (!connection) {
      throw new Error(`Connexion ${connectionId} introuvable.`);
    }

    connection.response = response;

    // Updates the connection in the store
    this.connectionStore.updateConnection(connection);

    NyxaEventBus.emit("connectionUpdated", connection);
  }

  /**
   * Updates the connection status
   * @param connectionId Connection ID
   * @param status Connection status
   * @param request Request object
   * @param response Response object
   */
  public updateConnectionStatus(
    connectionId: string,
    status: "COMPLETED" | "FAILED",
    request?: NyxaRequestInterface,
    response?: NyxaResponseInterface,
  ): void {
    const connection = this.connections.find(
      (conn) => conn.id === connectionId,
    );

    if (!connection) {
      throw new Error(`Connexion ${connectionId} introuvable.`);
    }

    connection.status = status;

    if (request) connection.request = request;
    if (response) connection.response = response;

    // Updates the connection in the store
    this.connectionStore.updateConnection(connection);

    NyxaEventBus.emit("connectionUpdated", connection);
  }

  /**
   * Verifies if a connection exists
   * @param connectionId Connection ID
   */
  public hasConnection(connectionId: string): boolean {
    return !!this.connections.find((conn) => conn.id === connectionId);
  }

  /**
   * Returns all connections
   */
  public getConnections(): NyxaConnectionInterface[] {
    return [...this.connections];
  }
}
