import { NyxaHubType } from "../types/hubType";
import { NyxaNodeInterface } from "./nodeInterface";

/**
 * Hub interface
 * @description Interface for a hub that contains nodes
 */
export interface NyxaHubInterface {
  /** Hub identifier */
  id: string;
  /** Hub type */
  type: NyxaHubType;
  /** Hub attached nodes */
  nodes: NyxaNodeInterface[];
  /** Hub name */
  name?: string;
}
