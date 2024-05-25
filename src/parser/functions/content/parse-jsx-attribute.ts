import type { JSXAttribute, JSXSpreadAttribute } from "@babel/types";
import type { Content } from "../../types/content";
import { parseJsxAttributeName } from "./parse-jsx-attribute-name";
import { parseJsxAttributeValue } from "./parse-jsx-attribute-value";

export function parseJsxAttribute(attr: JSXAttribute | JSXSpreadAttribute): Content {
  if (attr.type === "JSXAttribute") {
    const name = parseJsxAttributeName(attr.name);
    const value = parseJsxAttributeValue(attr.value);

    return {
      args: value.args,
      text: name + value.text,
    };
  }

  throw `${__filename}: ${JSON.stringify(attr)}`;
}