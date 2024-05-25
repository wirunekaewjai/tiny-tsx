import type { BlockStatement, Expression } from "@babel/types";
import { v4 } from "uuid";
import type { Content } from "../../types/content";
import { parseArrayExpression } from "./parse-array-expression";
import { parseBinaryExpression } from "./parse-binary-expression";
import { parseIdentifier } from "./parse-identifier";
import { parseJsxElement } from "./parse-jsx-element";
import { parseJsxFragment } from "./parse-jsx-fragment";
import { parseMemberExpression } from "./parse-member-expression";
import { parseObjectExpression } from "./parse-object-expression";
import { parseTemplateLiteral } from "./parse-template-literal";

export function parseCallExpressionMacroMap(expr: Expression | BlockStatement): Content {
  if (expr === null) {
    return {
      args: [],
      text: "null",
    };
  }

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
    return parseTemplateLiteral(expr, 0);
  }

  if (expr.type === "ObjectExpression") {
    return parseObjectExpression(expr, 0);
  }

  if (expr.type === "ArrayExpression") {
    return parseArrayExpression(expr, 0);
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

  if (expr.type === "JSXElement") {
    return parseJsxElement(expr);
  }

  if (expr.type === "JSXFragment") {
    return parseJsxFragment(expr);
  }

  throw `${__filename}: ${JSON.stringify(expr)}`;
}