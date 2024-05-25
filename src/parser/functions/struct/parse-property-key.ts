import type { Expression } from "@babel/types";

export function parsePropertyKey(expr: Expression) {
  if (expr.type === "Identifier") {
    return expr.name;
  }

  if (expr.type === "StringLiteral" || expr.type === "NumericLiteral" || expr.type === "BooleanLiteral") {
    return `${expr.value}`;
  }

  throw `${__filename}: ${JSON.stringify(expr)}`;
}