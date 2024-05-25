import type { JSXOpeningElement } from "@babel/types";

export function parseJsxElementName(element: JSXOpeningElement) {
  if (element.name.type === "JSXIdentifier") {
    return element?.name.name;
  }

  throw `${__filename}: ${JSON.stringify(element)}`;
}