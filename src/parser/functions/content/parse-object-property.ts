import type { ObjectMethod, ObjectProperty, SpreadElement } from "@babel/types";
import type { Content } from "../../types/content";
import { parseObjectPropertyKey } from "./parse-object-property-key";
import { parseObjectPropertyValue } from "./parse-object-property-value";

export function parseObjectProperty(prop: ObjectProperty | ObjectMethod | SpreadElement, depth: number): Content {
  if (prop.type === "ObjectProperty") {
    const key = parseObjectPropertyKey(prop.key);
    const value = parseObjectPropertyValue(prop.value, depth);

    return {
      args: value.args,
      text: `"${key}":${value.text}`,
    };
  }

  throw `${__filename}: ${JSON.stringify(prop)}`;
}