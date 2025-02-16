/**
 * Generates a random unique ID with a given prefix
 * @param prefix The prefix for the ID (e.g., "req", "res", "node")
 * @returns A random unique ID with the given prefix
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
};

export const generateRequestId = (): string => generateId("req");
export const generateResponseId = (): string => generateId("res");
export const generateConnectionId = (): string => generateId("connection");
export const generateNodeId = (): string => generateId("node");
export const generateConnectorId = (): string => generateId("connector");
