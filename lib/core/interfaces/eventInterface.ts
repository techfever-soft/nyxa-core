import { NyxaConnectionType } from "../types/connectionType";

/**
 * Created connection event interface
 * @description Emitted when a connection is created
 */
export interface NyxaCreatedConnectionEventInterface {
  /** State of the creation */
  created: boolean;
  /** Client action */
  action: {
    /** Type of action */
    type: NyxaConnectionType;
    /** Action ID */
    actionId: string;
    /** Endpoint ID */
    endpointId: string;
    /** Element reference */
    el: HTMLElement | null;
  };
  /** Server endpoint */
  endpoint: {
    /** Type of endpoint */
    type: NyxaConnectionType;
    /** Action ID */
    actionId: string;
    /** Endpoint ID */
    endpointId: string;
    /** Element reference */
    el: HTMLElement | null;
  };
}
