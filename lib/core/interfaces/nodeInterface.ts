import { NyxaNodeStatus, NyxaNodeType } from "../types/nodeType";
import { NyxaConnectorInterface } from "./connectorInterface";
import { NyxaRequestInterface } from "./requestInterface";

/**
 * Node interface
 * @description Used to be a child of a hub
 */
export interface NyxaNodeInterface {
  /** Node identifier */
  id: string;
  /** Node name */
  name?: string;
  /** Node type */
  type: NyxaNodeType;
  /** Node state */
  status?: NyxaNodeStatus;
  /** Node attached connectors */
  connectors?: NyxaConnectorInterface[];
}

/**
 * Client node interface
 * @description Used to define a client node (action)
 */
export interface NyxaClientNodeInterface extends NyxaNodeInterface {
  /** Type of node */
  type: "action";
  /** Request attached */
  request: NyxaRequestInterface;
}

export interface NyxaServerNodeInterface extends NyxaNodeInterface {
  /** Type of node */
  type: "endpoint";
  /** Endpoint URL */
  endpoint: string;
}
