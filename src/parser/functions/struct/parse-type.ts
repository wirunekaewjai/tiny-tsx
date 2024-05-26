import type { TSType } from "@babel/types";
import { toPascalCase } from "../to-pascal-case";
import { parseTypeReferenceName } from "./parse-type-reference-name";

const PRIMITIVE_TYPES = [
  "i8",
  "i16",
  "i32",
  "i64",

  "u8",
  "u16",
  "u32",
  "u64",

  "f32",
  "f64",
];

export function parseType(fileName: string, type: TSType): string {
  if (type.type === "TSTypeReference") {
    const name = parseTypeReferenceName(type.typeName);

    if (PRIMITIVE_TYPES.includes(name)) {
      return name;
    }

    return toPascalCase(fileName) + toPascalCase(name);
  }

  if (type.type === "TSStringKeyword") {
    return "string";
  }

  if (type.type === "TSBooleanKeyword") {
    return "boolean";
  }

  if (type.type === "TSNumberKeyword") {
    return "number";
  }

  if (type.type === "TSArrayType") {
    return `${parseType(fileName, type.elementType)}[]`;
  }

  throw `${__filename}: ${JSON.stringify(type)}`;
}