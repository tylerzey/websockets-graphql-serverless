export function getTableName(): string {
  const tableName = process.env.activityTable;

  if (!tableName) {
    throw new Error("tableName is not defined");
  }

  return tableName;
}

export function getWebsocketEndpoint(): string {
  const websocketEndpoint = process.env.websocketEndpoint;

  if (!websocketEndpoint) {
    throw new Error("websocketEndpoint is not defined");
  }

  return websocketEndpoint;
}
