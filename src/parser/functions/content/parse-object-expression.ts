import type { ObjectExpression } from "@babel/types";
import { v4 } from "uuid";
import type { Content } from "../../types/content";
import { parseObjectProperty } from "./parse-object-property";

export function parseObjectExpression(expr: ObjectExpression, depth: number): Content {
  const { properties } = expr;

  const inner: Content = {
    args: [],
    text: "",
  };

  inner.text += "{";

  properties.forEach((prop, index) => {
    if (index > 0) {
      inner.text += ",";
    }

    const out = parseObjectProperty(prop, depth + 1);

    inner.args.push(...out.args);
    inner.text += out.text;
  });

  inner.text += "}";

  if (depth > 0) {
    return inner;
  }

  const id = v4();

  return {
    args: [
      {
        type: "ObjectExpression",
        id,
        value: inner,
      },
    ],
    text: id,
  };
}