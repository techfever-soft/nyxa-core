import { NyxaConnectorInterface } from "../core/interfaces/connectorInterface.js";
import { NyxaHubStore } from "../store/hubStore.js";
import { generateConnectorId } from "../utils/generateId.js";
import { NyxaNodeManager } from "./nodeManager.js";

export class NyxaConnectorManager {
  private static instance: NyxaConnectorManager;

  private nodeManager: NyxaNodeManager;
  private hubStore: NyxaHubStore;

  constructor() {
    this.hubStore = NyxaHubStore.getInstance();
    this.nodeManager = NyxaNodeManager.getInstance();
  }

  public static getInstance(): NyxaConnectorManager {
    if (!NyxaConnectorManager.instance) {
      NyxaConnectorManager.instance = new NyxaConnectorManager();
    }

    return NyxaConnectorManager.instance;
  }

  /**
   * Add a new connector to a node
   * @param nodeId Node ID
   * @param type Type of connector
   * @param element Element to connect
   * @returns The new connector
   */
  public addConnectorToNode(
    nodeId: string,
    type: "request" | "response",
    element: HTMLElement | null,
  ): NyxaConnectorInterface {
    if (!this.hubStore.getNodeById(nodeId)) {
      throw new Error(`Node ${nodeId} not found.`);
    }

    const connectorId = generateConnectorId();

    const connector: NyxaConnectorInterface = {
      id: connectorId,
      parentNode: nodeId,
      type,
      element,
      connectedTo: null,
    };

    // Add the new connector to the node and store
    this.nodeManager.addConnectorToNode(nodeId, connector);

    return connector;
  }

  /**
   * Register the element of a connector
   * @param connectorId Connector ID
   * @param element Element to connect
   */
  public registerConnectorElement(
    connectorId: string,
    element: HTMLElement | null,
  ) {
    const connector = this.hubStore.getConnectorById(connectorId);

    if (!connector) {
      throw new Error("Connector not found");
    }

    connector.element = element;

    // Update connector with new element
    this.hubStore.updateConnector(connectorId, connector);
  }

  /**
   * Get a connector by ID
   * @param connectorId Connector ID
   * @returns The connector
   */
  public getConnectorById(connectorId: string): Readonly<NyxaConnectorInterface> | undefined {
    const connector = this.hubStore.getConnectorById(connectorId);
    return connector ? { ...connector } : undefined;
  }

  /**
   * Get connectors of the specified type
   * @param type Type of connector
   * @returns Connectors of the specified type
   */
  public getConnectorsByType(type: "request" | "response"): NyxaConnectorInterface[] {
    return this.hubStore.getConnectors().filter(connector => connector.type === type);
  }

  /**
   * Get connectors of the specified node
   * @param nodeId Node ID
   */
  public getConnectorsByNode(nodeId: string): NyxaConnectorInterface[] {
    return this.hubStore.getConnectors().filter(connector => connector.parentNode === nodeId);
  }

  /**
   * Get all connectors
   * @returns All connectors
   */
  public getConnectors(): NyxaConnectorInterface[] {
    return this.hubStore.getConnectors();
  }
}
