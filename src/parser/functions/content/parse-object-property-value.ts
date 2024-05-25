import type { Expression, PatternLike } from "@babel/types";
import { v4 } from "uuid";
import type { Content } from "../../types/content";
import { parseArrayExpression } from "./parse-array-expression";
import { parseBinaryExpression } from "./parse-binary-expression";
import { parseIdentifier } from "./parse-identifier";
import { parseMemberExpression } from "./parse-member-expression";
import { parseObjectExpression } from "./parse-object-expression";
import { parseTemplateLiteral } from "./parse-template-literal";

export function parseObjectPropertyValue(expr: Expression | PatternLike, depth: number): Content {
  if (expr.type === "Identifier") {
    return parseIdentifier(expr);
  }

  if (expr.type === "StringLiteral") {
    return {
      args: [],
      text: `"${expr.value}"`,
    };
  }

  if (expr.type === "NumericLiteral" || expr.type === "BooleanLiteral") {
    return {
      args: [],
      text: `${expr.value}`,
    };
  }

  if (expr.type === "TemplateLiteral") {
    return parseTemplateLiteral(expr, depth + 1);
  }

  if (expr.type === "ObjectExpression") {
    return parseObjectExpression(expr, depth + 1);
  }

  if (expr.type === "ArrayExpression") {
    return parseArrayExpression(expr, depth + 1);
  }

  if (expr.type === "BinaryExpression") {
    return parseBinaryExpression(expr);
  }

  if (expr.type === "MemberExpression") {
    const id = v4();

    return {
      args: [
        {
          type: "Identifier",
          id,
          value: parseMemberExpression(expr),
        }
      ],
      text: id,
    };
  }

  throw `${__filename}: ${JSON.stringify(expr)}`;
}