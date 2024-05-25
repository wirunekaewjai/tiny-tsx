import type { MemberExpression } from "@babel/types";
import { parseBinaryChildExpression } from "./parse-binary-child-expression";

export function parseMemberExpression(expr: MemberExpression): string {
  const name = parseBinaryChildExpression(expr.property);
  const obj = expr.object;

  if (obj.type === "MemberExpression") {
    return `${parseMemberExpression(obj)}.${name}`;
  }

  if (obj.type === "Identifier") {
    return `${obj.name}.${name}`;
  }

  throw `${__filename}: ${JSON.stringify(obj)}`;
}