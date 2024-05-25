import type { TSInterfaceBody } from "@babel/types";
import type { StructProperty } from "../../types/struct";
import { parseTypeElement } from "./parse-type-element";

export function parseInterfaceBody(fileName: string, body: TSInterfaceBody): StructProperty[] {
  return body.body.map((element) => {
    return parseTypeElement(fileName, element);
  });
}