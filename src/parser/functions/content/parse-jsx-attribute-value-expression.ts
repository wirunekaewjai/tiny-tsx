import type { Expression, JSXEmptyExpression } from "@babel/types";
import { v4 } from "uuid";
import type { Content } from "../../types/content";
import { parseArrayExpression } from "./parse-array-expression";
import { parseBinaryExpression } from "./parse-binary-expression";
import { parseObjectExpression } from "./parse-object-expression";
import { parseTemplateLiteral } from "./parse-template-literal";
import { parseMemberExpression } from "./parse-member-expression";

export function parseJsxAttributeValueExpression(expr: Expression | JSXEmptyExpression): Content {
  if (expr.type === "JSXEmptyExpression") {
    // do nothing...
    return {
      args: [],
      text: "",
    };
  }

  if (expr.type === "Identifier") {
    const id = v4();

    return {
      args: [
        {
          type: "Identifier",
          id,
          value: expr.name,
        },
      ],
      text: `="${id}"`,
    };
  }

  if (expr.type === "StringLiteral" || expr.type === "NumericLiteral" || expr.type === "BooleanLiteral") {
    return {
      args: [],
      text: `="${expr.value}"`,
    };
  }

  if (expr.type === "TemplateLiteral") {
    const out = parseTemplateLiteral(expr, 0);

    return {
      args: out.args,
      text: `="${out.text}"`,
    };
  }

  if (expr.type === "ObjectExpression") {
    const out = parseObjectExpression(expr, 0);

    return {
      args: out.args,
      text: `="${out.text}"`,
    };
  }

  if (expr.type === "ArrayExpression") {
    const out = parseArrayExpression(expr, 0);

    return {
      args: out.args,
      text: `="${out.text}"`,
    };
  }

  if (expr.type === "BinaryExpression") {
    const out = parseBinaryExpression(expr);

    return {
      args: out.args,
      text: `="${out.text}"`,
    };
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
      text: `="${id}"`,
    };
  }

  throw `${__filename}: ${JSON.stringify(expr)}`;
}