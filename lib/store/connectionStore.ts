import { BehaviorSubject, Observable } from "rxjs";
import { NyxaConnectionInterface } from "../core/interfaces/connectionInterface";

export class NyxaConnectionStore {
  private static instance: NyxaConnectionStore;

  private connectionsSubject: BehaviorSubject<NyxaConnectionInterface[]> =
    new BehaviorSubject<NyxaConnectionInterface[]>([]);

  private constructor() {}

  public static getInstance(): NyxaConnectionStore {
    if (!NyxaConnectionStore.instance) {
      NyxaConnectionStore.instance = new NyxaConnectionStore();
    }
    return NyxaConnectionStore.instance;
  }

  /**
   * Set connections in the store
   * @param connections Connections to set
   */
  public setConnections(connections: NyxaConnectionInterface[]): void {
    this.connectionsSubject.next([...connections]);
  }

  /**
   * Add a connection to the store
   * @param connection Connection to add
   */
  public addConnection(connection: NyxaConnectionInterface): void {
    const connections = this.connectionsSubject.getValue();
    if (!connections.some(c => c.id === connection.id)) {
      this.connectionsSubject.next([...connections, connection]);
    }
  }

  /**
   * Remove a connection from the store
   * @param connection Connection to remove
   */
  public removeConnection(connection: NyxaConnectionInterface): void {
    const connections = this.connectionsSubject.getValue().filter(c => c.id !== connection.id);
    this.connectionsSubject.next(connections);
  }

  /**
   * Update a connection in the store
   * @param connection Connection to update
   */
  public updateConnection(connection: NyxaConnectionInterface): void {
    const connections = this.connectionsSubject.getValue().map(c => c.id === connection.id ? connection : c);
    this.connectionsSubject.next(connections);
  }

  /**
   * Get a connection by ID
   * @param connectionId Connection ID
   * @returns The connection with the given ID, or undefined if not found
   */
  public getConnectionById(connectionId: string): NyxaConnectionInterface | undefined {
    return this.connectionsSubject.getValue().find(c => c.id === connectionId);
  }

  /**
   * Get connections from the store
   * @returns Observable of connections
   */
  public getConnections(): Observable<NyxaConnectionInterface[]> {
    return this.connectionsSubject.asObservable();
  }
}
