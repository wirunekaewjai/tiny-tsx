import type { ArgumentPlaceholder, Expression, SpreadElement } from "@babel/types";
import { parseMemberExpression } from "./parse-member-expression";

export function parseCallExpressionMacroQuot(expr: Expression | SpreadElement | ArgumentPlaceholder): string {
  if (expr.type === "Identifier") {
    return expr.name;
  }

  if (expr.type === "MemberExpression") {
    return parseMemberExpression(expr);
  }

  throw `${__filename}: ${JSON.stringify(expr)}`;
}