import { NyxaResponseInterface } from "./responseInterface";

/**
 * Request interface
 * @description Used to store request and optional response
 */
export interface NyxaRequestInterface {
  /** Request identifier */
  id: string;
  /** HTTP Method */
  method: string;
  /** Request endpoint */
  endpoint: string;
  /** Request headers */
  headers: { [key: string]: any };
  /** Request body */
  body: any;
  /** Optional response storage */
  response?: NyxaResponseInterface;
}
