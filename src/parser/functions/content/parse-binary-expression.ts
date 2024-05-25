import type { BinaryExpression } from "@babel/types";
import { v4 } from "uuid";
import type { Content } from "../../types/content";
import { parseBinaryChildExpression } from "./parse-binary-child-expression";

export function parseBinaryExpression(expr: BinaryExpression): Content {
  const left = parseBinaryChildExpression(expr.left);
  const right = parseBinaryChildExpression(expr.right);
  const id = v4();

  return {
    args: [
      {
        type: "Expression",
        id,
        value: `${left} ${expr.operator} ${right}`,
      },
    ],
    text: id,
  };
}