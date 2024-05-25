export function tsx_quot(value: string): string {
  return value.replace(/"/g, "&quot;");
}

export function tsx_map<T>(items: T[], render: (item: T) => string): string {
  return items.map(render).join("");
}