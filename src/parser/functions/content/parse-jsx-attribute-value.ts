import type { JSXElement, JSXExpressionContainer, JSXFragment, StringLiteral } from "@babel/types";
import type { Content } from "../../types/content";
import { parseJsxAttributeValueExpression } from "./parse-jsx-attribute-value-expression";

export function parseJsxAttributeValue(value: JSXElement | JSXFragment | StringLiteral | JSXExpressionContainer | null | undefined): Content {
  if (value === null || typeof value === "undefined") {
    return {
      args: [],
      text: "",
    };
  }

  if (value.type === "StringLiteral") {
    return {
      args: [],
      text: '="' + value.value + '"',
    };
  }

  if (value.type === "JSXExpressionContainer") {
    return parseJsxAttributeValueExpression(value.expression);
  }

  throw `${__filename}: ${JSON.stringify(value)}`;
}