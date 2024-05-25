import type { JSXText } from "@babel/types";

export function parseJsxText(stmt: JSXText) {
  return stmt.value.trim();
}