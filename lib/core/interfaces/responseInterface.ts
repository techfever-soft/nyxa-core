/**
 * Response interface
 * @description Used to define a HTTP response
 */
export interface NyxaResponseInterface {
  /** Response identifier */
  id: string; // UUID de la réponse
  /** HTTP response code */
  status: number;
  /** HTTP response message */
  statusText: string;
  /** Response time in ms */
  responseTime: number;
  /** Response headers */
  headers?: { [key: string]: string };
  /** Response body */
  body?: any;
}
