import type { TemplateLiteral } from "@babel/types";
import { v4 } from "uuid";
import type { Content } from "../../types/content";
import { parseTemplateLiteralExpression } from "./parse-template-literal-expression";

export function parseTemplateLiteral(tmpl: TemplateLiteral, depth: number): Content {
  const exprs = tmpl.expressions;
  const quasis = tmpl.quasis;

  const inner: Content = {
    args: [],
    text: "",
  };

  for (let i = 0; i < quasis.length; i++) {
    const e = exprs[i];
    const q = quasis[i];

    inner.text += q.value.raw;

    if (e) {
      const res = parseTemplateLiteralExpression(e);

      if (res) {
        inner.args.push(...res.args);
        inner.text += res.text;
      }
    }
  }

  if (depth > 0) {
    const id = v4();

    return {
      args: [
        {
          type: "TemplateLiteral",
          id,
          value: inner,
        }
      ],
      text: id,
    };
  }

  return inner;
}