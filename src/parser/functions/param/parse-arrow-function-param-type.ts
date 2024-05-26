import type { Noop, TSTypeAnnotation, TypeAnnotation } from "@babel/types";
import { parseType } from "../struct/parse-type";

export function parseArrowFunctionParamType(fileName: string, type: TypeAnnotation | TSTypeAnnotation | Noop | null | undefined): string {
  if (type?.type === "TSTypeAnnotation") {
    return parseType(fileName, type.typeAnnotation);
  }

  throw `${__filename}: ${JSON.stringify(type)}`;
}