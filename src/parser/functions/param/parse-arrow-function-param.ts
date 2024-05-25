import type { Identifier, Pattern, RestElement } from "@babel/types";
import type { FunctionParam } from "../../types/param";
import { parseArrowFunctionParamType } from "./parse-arrow-function-param-type";

export function parseArrowFunctionParam(fileName: string, param: Identifier | Pattern | RestElement): FunctionParam {
  if (param.type === "Identifier") {
    const name = param.name;
    const type = parseArrowFunctionParamType(fileName, param.typeAnnotation);

    return {
      name,
      type,
    };
  }

  throw `${__filename}: ${JSON.stringify(param)}`;
}