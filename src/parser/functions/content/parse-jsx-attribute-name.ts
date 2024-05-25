import type { JSXIdentifier, JSXNamespacedName, JSXOpeningElement } from "@babel/types";

export function parseJsxAttributeName(name: JSXIdentifier | JSXNamespacedName) {
  if (name.type === "JSXIdentifier") {
    return name.name;
  }

  throw `${__filename}: ${JSON.stringify(name)}`;
}