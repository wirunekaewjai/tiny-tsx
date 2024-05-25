export function tsx_quot(value: string): string {
  return value.replace(/"/g, "&quot;");
}

export function tsx_map<T>(items: T[], render: (item: T) => string): string {
  return items.map(render).join("");
}

export function tsx_json<T>(item: T): string {
  return tsx_quot(JSON.stringify(item));
}

export function tsx_json_pretty<T>(item: T): string {
  return tsx_quot(JSON.stringify(item, null, 2));
}