import type { ArrowFunctionExpression, CallExpression, Identifier } from "@babel/types";
import { v4 } from "uuid";
import type { Content } from "../../types/content";
import { parseCallExpressionMacroJoin } from "./parse-call-expression-macro-join";
import { parseCallExpressionMacroMap } from "./parse-call-expression-macro-map";
import { parseCallExpressionMacroQuot } from "./parse-call-expression-macro-quot";

export function parseCallExpression(expr: CallExpression): Content {
  const callee = expr.callee;
  const args = expr.arguments;

  if (callee.type === "Identifier") {
    if (callee.name === "map") {
      const arg0 = args[0] as Identifier;
      const arg0Name = arg0.name;

      const arg1 = args[1] as ArrowFunctionExpression;
      const arg1Param = arg1.params[0] as Identifier;

      const id = v4();

      return {
        args: [
          {
            type: "MacroMap",
            id,
            value: {
              items: arg0Name,
              item: arg1Param.name,
              content: parseCallExpressionMacroMap(arg1.body),
            },
          }
        ],
        text: id,
      };
    }

    if (callee.name === "quot") {
      const id = v4();

      return {
        args: [
          {
            type: "MacroQuot",
            id,
            value: parseCallExpressionMacroQuot(args[0]),
          }
        ],
        text: id,
      };
    }

    if (callee.name === "join") {
      const id = v4();

      return {
        args: [
          {
            type: "MacroJoin",
            id,
            value: parseCallExpressionMacroJoin(args[0]),
          }
        ],
        text: id,
      };
    }
  }

  throw `${__filename}: ${JSON.stringify(expr)}`;
}