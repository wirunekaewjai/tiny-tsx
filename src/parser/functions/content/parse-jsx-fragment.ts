import type { JSXFragment } from "@babel/types";
import type { Content } from "../../types/content";
import { parseJsxChild } from "./parse-jsx-child";

export function parseJsxFragment(stmt: JSXFragment): Content {
  const result: Content = {
    args: [],
    text: "",
  };

  stmt.children.forEach((child) => {
    const out = parseJsxChild(child);

    result.args.push(...out.args);
    result.text += out.text;
  });

  return result;
};