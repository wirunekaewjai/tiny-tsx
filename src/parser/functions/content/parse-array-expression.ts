import type { ArrayExpression } from "@babel/types";
import { v4 } from "uuid";
import type { Content } from "../../types/content";
import { parseArrayElement } from "./parse-array-element";

export function parseArrayExpression(expr: ArrayExpression, depth: number): Content {
  const { elements } = expr;

  const inner: Content = {
    args: [],
    text: "",
  };

  inner.text += "[";

  elements.forEach((element, index) => {
    if (index > 0) {
      inner.text += ",";
    }

    const out = parseArrayElement(element, depth + 1);

    inner.args.push(...out.args);
    inner.text += out.text;
  });

  inner.text += "]";

  if (depth > 0) {
    return inner;
  }

  const id = v4();

  return {
    args: [
      {
        type: "ArrayExpression",
        id,
        value: inner,
      },
    ],
    text: id,
  };
}