import type { BlockStatement, Expression } from "@babel/types";
import type { Content } from "../../types/content";
import { parseJsxElement } from "./parse-jsx-element";
import { parseJsxFragment } from "./parse-jsx-fragment";

export function parseBodyExpression(expr: Expression | BlockStatement): Content {
  if (expr.type === "JSXElement") {
    return parseJsxElement(expr);
  }

  if (expr.type === "JSXFragment") {
    return parseJsxFragment(expr);
  }

  throw `${__filename}: ${JSON.stringify(expr)}`;
}