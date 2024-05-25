import type { Expression, PrivateName } from "@babel/types";
import { parseMemberExpression } from "./parse-member-expression";

export function parseBinaryChildExpression(expr: Expression | PrivateName) {
  if (expr.type === "Identifier") {
    return expr.name;
  }

  if (expr.type === "StringLiteral" || expr.type === "NumericLiteral" || expr.type === "BooleanLiteral") {
    return `${expr.value}`;
  }

  if (expr.type === "MemberExpression") {
    return parseMemberExpression(expr);
  }

  throw `${__filename}: ${JSON.stringify(expr)}`;
}