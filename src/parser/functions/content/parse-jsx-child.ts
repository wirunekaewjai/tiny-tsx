import type { JSXElement, JSXExpressionContainer, JSXFragment, JSXSpreadChild, JSXText } from "@babel/types";
import type { Content } from "../../types/content";
import { parseJsxChildExpression } from "./parse-jsx-child-expression";
import { parseJsxElement } from "./parse-jsx-element";
import { parseJsxFragment } from "./parse-jsx-fragment";
import { parseJsxText } from "./parse-jsx-text";

export function parseJsxChild(child: JSXElement | JSXFragment | JSXText | JSXExpressionContainer | JSXSpreadChild): Content {
  if (child.type === "JSXElement") {
    return parseJsxElement(child);
  }

  if (child.type === "JSXText") {
    return {
      args: [],
      text: parseJsxText(child),
    };
  }

  if (child.type === "JSXFragment") {
    return parseJsxFragment(child);
  }

  if (child.type === "JSXExpressionContainer") {
    return parseJsxChildExpression(child.expression);
  }

  throw `${__filename}: ${JSON.stringify(child)}`;
}