export function tsx_join<T>(items: T[]): string {
  return items.join("");
}

export function tsx_map<T>(items: T[], render: (item: T) => string): string {
  return items.map(render).join("");
}

export function tsx_quot(value: string): string {
  return value.replace(/"/g, "&quot;");
}
