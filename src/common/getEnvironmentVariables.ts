export function getTableName(): string {
  const tableName = process.env.activityTable;
  if (!tableName) {
    throw new Error("tableName is not defined");
  }
  return tableName;
}
