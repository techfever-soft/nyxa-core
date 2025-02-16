import { NyxaConnectorInterface } from "../core/interfaces/connectorInterface.js";
import { NyxaHubStore } from "../store/hubStore.js";

export class NyxaNodeManager {
  private static instance: NyxaNodeManager;

  private hubStore: NyxaHubStore;

  constructor() {
    this.hubStore = NyxaHubStore.getInstance();
  }

  public static getInstance(): NyxaNodeManager {
    if (!NyxaNodeManager.instance) {
      NyxaNodeManager.instance = new NyxaNodeManager();
    }

    return NyxaNodeManager.instance;
  }

  /**
   * Update a connector for a node
   * @param nodeId Node ID
   * @param connector Connector to be updated
   */
  private updateNodeConnector(nodeId: string, connector: NyxaConnectorInterface): void {
    const currentNode = this.hubStore.getNodeById(nodeId);

    if (!currentNode) {
      throw new Error(`Node ${nodeId} not found.`);
    }

    if (!currentNode.connectors) {
      currentNode.connectors = [];
    }

    // Check if the connector already exists
    const existingConnector = currentNode.connectors.find(c => c.id === connector.id);

    if (!existingConnector) {
      currentNode.connectors.push(connector);
      this.hubStore.updateNode(nodeId, currentNode);
    }
  }

  /**
   * Add a connector to a node
   * @param nodeId Node ID
   * @param connector Connector to be added
   * @throws Error if the connector already exists
   * @returns void
   */
  public addConnectorToNode(nodeId: string, connector: NyxaConnectorInterface): void {
    if (this.hasConnector(nodeId, connector.id)) {
      throw new Error(`Connector ${connector.id} already exists for node ${nodeId}`);
    }

    this.updateNodeConnector(nodeId, connector);
  }

  /**
   * Check if a node has a connector by IDs
   * @param nodeId Node ID
   * @param connectorId Connector ID
   * @returns True if the node has the connector
   */
  public hasConnector(nodeId: string, connectorId: string): boolean {
    const node = this.hubStore.getNodeById(nodeId);
    return node ? !!node.connectors?.some(c => c.id === connectorId) : false;
  }

  /**
   * Get all connectors for a node
   * @param nodeId Node ID
   * @returns Array of connectors
   */
  public getNodeConnectors(nodeId: string): NyxaConnectorInterface[] {
    const node = this.hubStore.getNodeById(nodeId);

    return node ? [...(node.connectors || [])] : [];
  }

}
