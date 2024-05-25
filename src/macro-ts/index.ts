export function esc_quot(input: string) {
  return input.replace(/"/g, "&quot;");
}

export function map<T>(items: T[], render: (item: T) => string): string {
  return items.map(render).join("");
}

// export function json(input: unknown) {
//   return JSON.stringify(input).replace(/"/g, "&quot;");
// }