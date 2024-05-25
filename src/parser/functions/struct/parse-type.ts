import type { TSType } from "@babel/types";
import { parseTypeReferenceName } from "./parse-type-reference-name";
import { toPascalCase } from "../to-pascal-case";

const PRIMITIVE_TYPES = [
  "i8",
  "i16",
  "i32",
  "i64",

  "u8",
  "u16",
  "u32",
  "u64",

  "f8",
  "f16",
  "f32",
  "f64",
];

export function parseType(fileName: string, type: TSType) {
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

  throw `${__filename}: ${JSON.stringify(type)}`;
}