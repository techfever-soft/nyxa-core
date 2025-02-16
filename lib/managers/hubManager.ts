import { NyxaHubInterface } from "../core/interfaces/hubInterface.js";
import { NyxaNodeInterface } from "../core/interfaces/nodeInterface.js";
import { NyxaHubStore } from "../store/hubStore.js";
import { NyxaConnectorManager } from "./connectorManager.js";

export class NyxaHubManager {
  private static instance: NyxaHubManager;

  private hubStore: NyxaHubStore;
  private connectorManager: NyxaConnectorManager;

  private hubs: NyxaHubInterface[] = [];

  constructor() {
    this.hubStore = NyxaHubStore.getInstance();
    this.connectorManager = NyxaConnectorManager.getInstance();

    this.hubStore.getHubs().subscribe((hubs) => {
      this.hubs = hubs;
    });
  }

  public static getInstance() {
    if (!NyxaHubManager.instance) {
      NyxaHubManager.instance = new NyxaHubManager();
    }

    return NyxaHubManager.instance;
  }

  /**
   * Set the hubs
   * @param hubs The hubs to set
   */
  public setHubs(hubs: NyxaHubInterface[]) {
    this.hubStore.setHubs(hubs);

    // Adding I/O connectors to all nodes
    hubs.forEach((hub) => {
      hub.nodes.forEach((node) => {
        this.connectorManager.addConnectorToNode(node.id, "request", null);
        this.connectorManager.addConnectorToNode(node.id, "response", null);
      });
    });
  }

  /**
   * Add a hub to the store
   * @param hub The hub to add
   */
  public addHub(hub: NyxaHubInterface) {
    this.hubStore.addHub(hub);
  }

  /**
   * Remove a hub from the store
   * @param hub The hub to remove
   */
  public removeHub(hub: NyxaHubInterface) {
    this.hubStore.removeHub(hub);
  }

  /**
   * Get a node by its ID
   * @param nodeId The node ID
   * @returns The node with the given ID
   */
  public getNodeById(nodeId: string): NyxaNodeInterface | null {
    return this.hubs.flatMap(hub => hub.nodes).find(node => node.id === nodeId) || null;
  }
  

  /**
   * Get a hub by its ID
   * @param id The hub ID
   * @returns The hub with the given ID
   */
  public getHubById(id: string): NyxaHubInterface | undefined {
    return this.hubs.find((hub) => hub.id === id);
  }

  /**
   * Get all nodes from all hubs
   * @returns All nodes from all hubs
   */
  public getNodes(): NyxaNodeInterface[] {
    return this.hubs.flatMap(hub => hub.nodes);
  }

  /**
   * Get all nodes from a hub
   * @param type The type of hub
   * @returns All hubs with the given type
   */
  public getHubsByType(type: string): NyxaHubInterface[] {
    return this.hubs.filter(hub => hub.type === type);
  }

  /**
   * Get all hubs
   * @returns All hubs
   */
  public getHubs(): NyxaHubInterface[] {
    return [...this.hubs];
  }
}
