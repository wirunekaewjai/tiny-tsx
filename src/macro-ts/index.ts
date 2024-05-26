export function tsx_join<T>(items: T[]): string {
  return items.join("");
}

export function tsx_json_pretty<T>(value: T | string | boolean | number): string {
  return tsx_quot(JSON.stringify(value, null, 2));
}

export function tsx_json<T>(value: T | string | boolean | number): string {
  return tsx_quot(JSON.stringify(value));
}

export function tsx_map<T>(items: T[], render: (item: T) => string): string {
  return items.map(render).join("");
}

export function tsx_quot(value: string): string {
  return value.replace(/"/g, "&quot;");
}
