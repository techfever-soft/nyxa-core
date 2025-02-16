import { NyxaConnectionType } from "../types/connectionType";

/**
 * Connector interface
 * @description Used to define the connection between two opposite nodes
 */
export interface NyxaConnectorInterface {
  /** Unique identifier */
  id: string;
  /** Parent node ID */
  parentNode: string;
  /** Type of connector */
  type: NyxaConnectionType;
  /** Element reference */
  element: HTMLElement | null;
  /** Opposite connector ID */
  connectedTo: string | null;
}
