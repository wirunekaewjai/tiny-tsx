import type { TSTypeElement } from "@babel/types";
import type { StructProperty } from "../../types/struct";
import { parsePropertyKey } from "./parse-property-key";
import { parseType } from "./parse-type";

export function parseTypeElement(fileName: string, element: TSTypeElement): StructProperty {
  if (element.type === "TSPropertySignature") {
    const key = parsePropertyKey(element.key);
    const anno = element.typeAnnotation?.typeAnnotation;

    if (anno) {
      const type = parseType(fileName, anno);

      return {
        name: key,
        type,
      };
    }
  }

  throw `${__filename}: ${JSON.stringify(element)}`;
}