import { BehaviorSubject, Observable } from "rxjs";
import { NyxaHubInterface } from "../core/interfaces/hubInterface.js";
import { NyxaNodeInterface } from "../core/interfaces/nodeInterface.js";
import { NyxaConnectorInterface } from "../core/interfaces/connectorInterface.js";

export class NyxaHubStore {
  private static instance: NyxaHubStore;

  private hubsSubject: BehaviorSubject<NyxaHubInterface[]> =
    new BehaviorSubject<NyxaHubInterface[]>([]);

  private constructor() {}

  public static getInstance(): NyxaHubStore {
    if (!NyxaHubStore.instance) {
      NyxaHubStore.instance = new NyxaHubStore();
    }
    return NyxaHubStore.instance;
  }

  /**
   * Set hubs in the store
   * @param hubs Hubs to set
   */
  public setHubs(hubs: NyxaHubInterface[]): void {
    this.hubsSubject.next([...hubs]);
  }

  /**
   * Add a hub to the store
   * @param hub Hub to add
   */
  public addHub(hub: NyxaHubInterface): void {
    const hubs = this.hubsSubject.getValue();
    if (!hubs.some(h => h.id === hub.id)) {
      this.hubsSubject.next([...hubs, hub]);
    }
  }

  /**
   * Remove a hub from the store
   * @param hub Hub to remove
   */
  public removeHub(hub: NyxaHubInterface): void {
    const hubs = this.hubsSubject.getValue().filter(h => h.id !== hub.id);
    this.hubsSubject.next(hubs);
  }

  /**
   * Update a node in the store
   * @param nodeId Node ID
   * @param node New node
   */
  public updateNode(nodeId: string, node: NyxaNodeInterface): void {
    const hubs = this.hubsSubject.getValue();
    let updated = false;

    const updatedHubs = hubs.map(hub => {
      const updatedNodes = hub.nodes.map(n => {
        if (n.id === nodeId) {
          updated = true;
          return node;
        }
        return n;
      });

      return updated ? { ...hub, nodes: updatedNodes } : hub;
    });

    if (updated) {
      this.hubsSubject.next(updatedHubs);
    }
  }

  /**
   * Update a connector in the store
   * @param connectorId Connector ID
   * @param connector Connector
   */
  public updateConnector(connectorId: string, connector: NyxaConnectorInterface): void {
    const hubs = this.hubsSubject.getValue();

    const updatedHubs = hubs.map(hub => ({
      ...hub,
      nodes: hub.nodes.map(node => ({
        ...node,
        connectors: node.connectors?.map(c => (c.id === connectorId ? connector : c)) || [],
      })),
    }));

    this.hubsSubject.next(updatedHubs);
  }

  /**
   * Get node by ID
   * @param nodeId Node ID
   * @returns Node or undefined
   */
  public getNodeById(nodeId: string): NyxaNodeInterface | undefined {
    return this.hubsSubject.getValue().flatMap(hub => hub.nodes).find(node => node.id === nodeId);
  }

  /**
   * Get a hub by ID
   * @param hubId Hub ID
   * @returns Hub or undefined
   */
  public getHubById(hubId: string): NyxaHubInterface | undefined {
    return this.hubsSubject.getValue().find(hub => hub.id === hubId);
  }

  /**
   * Get connector by ID
   * @param connectorId Connector ID
   * @returns Connector or undefined
   */
  public getConnectorById(connectorId: string): NyxaConnectorInterface | undefined {
    return this.getConnectors().find(c => c.id === connectorId);
  }

  /**
   * Get all connectors
   * @returns All connectors
   */
  public getConnectors(): NyxaConnectorInterface[] {
    return this.hubsSubject.getValue().flatMap(hub => hub.nodes.flatMap(node => node.connectors || []));
  }

  /**
   * Get all hubs
   * @returns Observable of hubs
   */
  public getHubs(): Observable<NyxaHubInterface[]> {
    return this.hubsSubject.asObservable();
  }
}
