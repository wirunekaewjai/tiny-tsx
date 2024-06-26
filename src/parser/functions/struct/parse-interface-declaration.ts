import type { TSInterfaceDeclaration } from "@babel/types";
import type { Struct } from "../../types/struct";
import { toPascalCase } from "../to-pascal-case";
import { parseInterfaceBody } from "./parse-interface-body";
import { parseInterfaceDeriveds } from "./parse-interface-deriveds";

export function parseInterfaceDeclaration(fileName: string, d: TSInterfaceDeclaration): Struct {
  const name = toPascalCase(fileName) + toPascalCase(d.id.name);
  const body = d.body;

  return {
    name,
    properties: parseInterfaceBody(fileName, body),
    deriveds: parseInterfaceDeriveds(d.extends),
  };
}