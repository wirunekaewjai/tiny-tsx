import type { JSXIdentifier, JSXNamespacedName } from "@babel/types";

export function parseJsxAttributeName(name: JSXIdentifier | JSXNamespacedName): string {
  if (name.type === "JSXIdentifier") {
    return name.name;
  }

  throw `${__filename}: ${JSON.stringify(name)}`;
}