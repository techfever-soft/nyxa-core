/**
 * Response interface
 * @description Used to define a HTTP response
 */
export interface NyxaResponseInterface {
  /** Response identifier */
  id: string; 
  /** HTTP response code */
  status: number;
  /** HTTP response message */
  statusText: string;
  /** Response time in ms */
  responseTime: number;
  /** Response headers */
  headers?: { [key: string]: any };
  /** Response body */
  body?: any;
}
