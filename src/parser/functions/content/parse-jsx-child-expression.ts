import type { ArrowFunctionExpression, Expression, Identifier, JSXEmptyExpression } from "@babel/types";
import { v4 } from "uuid";
import type { Content } from "../../types/content";
import { parseArrayExpression } from "./parse-array-expression";
import { parseBinaryExpression } from "./parse-binary-expression";
import { parseJsxElement } from "./parse-jsx-element";
import { parseMemberExpression } from "./parse-member-expression";
import { parseObjectExpression } from "./parse-object-expression";
import { parseTemplateLiteral } from "./parse-template-literal";

export function parseJsxChildExpression(expr: Expression | JSXEmptyExpression): Content {
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
      text: id,
    };
  }

  if (expr.type === "StringLiteral" || expr.type === "NumericLiteral" || expr.type === "BooleanLiteral") {
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

  if (expr.type === "CallExpression") {
    const callee = expr.callee;
    const args = expr.arguments;

    if (callee.type === "Identifier") {
      if (callee.name === "map") {
        const arg0 = args[0] as Identifier;
        const arg0Name = arg0.name;

        const arg1 = args[1] as ArrowFunctionExpression;
        const arg1Param = arg1.params[0] as Identifier;

        if (arg1.body.type === "JSXElement") {
          const content = parseJsxElement(arg1.body);
          const id = v4();

          return {
            args: [
              {
                type: "CallExpressionMapJSXElement",
                id,
                value: {
                  items: arg0Name,
                  item: arg1Param.name,
                  content,
                },
              }
            ],
            text: id,
          };
        }
      }
    }
  }

  throw `${__filename}: ${JSON.stringify(expr)}`;
}