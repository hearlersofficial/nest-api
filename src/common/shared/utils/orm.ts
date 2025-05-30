export function createAlias(tableName: string, prefix: string = ""): string {
  return prefix ? `${prefix}_${tableName}` : tableName;
}
