import type { JSXElement } from "@babel/types";
import type { Content } from "../../types/content";
import { parseJsxAttribute } from "./parse-jsx-attribute";
import { parseJsxChild } from "./parse-jsx-child";
import { parseJsxElementName } from "./parse-jsx-element-name";

const SELF_CLOSING_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);

export function parseJsxElement(stmt: JSXElement): Content {
  const result: Content = {
    args: [],
    text: "",
  };

  const open = stmt.openingElement;
  const name = parseJsxElementName(stmt.openingElement);

  result.text += "<" + name;

  open.attributes.forEach((attr) => {
    const res = parseJsxAttribute(attr);

    result.args.push(...res.args);
    result.text += " " + res.text;
  });

  result.text += ">";

  if (!SELF_CLOSING_TAGS.has(name)) {
    stmt.children.forEach((child) => {
      const out = parseJsxChild(child);

      result.args.push(...out.args);
      result.text += out.text;
    });

    result.text += "</" + name + ">";
  }

  return result;
};