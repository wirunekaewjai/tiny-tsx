export function esc_quot(input: string) {
  return input.replace(/"/g, "&quot;");
}

// export function json(input: unknown) {
//   return JSON.stringify(input).replace(/"/g, "&quot;");
// }