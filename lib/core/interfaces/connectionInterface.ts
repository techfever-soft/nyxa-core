import { NyxaNodeStatus } from "../types/nodeType";
import { NyxaNodeInterface } from "./nodeInterface";
import { NyxaRequestInterface } from "./requestInterface";
import { NyxaResponseInterface } from "./responseInterface";

/**
 * Connection interface
 * @description Used to define the connection between two nodes
 */
export interface NyxaConnectionInterface {
  /** Unique identifier */
  id: string;
  /** Source node (action) */
  source: NyxaNodeInterface;
  /** Target node (endpoint) */
  target: NyxaNodeInterface;
  /* Connection state */
  status: NyxaNodeStatus;
  /* Optional request object */
  request?: NyxaRequestInterface;
  /* Optional response object */
  response?: NyxaResponseInterface;
  /* Optional draw object */
  draw?: any;
}
