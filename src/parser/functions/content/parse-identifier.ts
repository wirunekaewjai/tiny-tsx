import type { Identifier } from "@babel/types";
import { v4 } from "uuid";
import type { Content } from "../../types/content";

export function parseIdentifier(expr: Identifier): Content {
  const id = v4();

  return {
    args: [
      {
        type: "Identifier",
        id,
        value: expr.name,
      },
    ],
    text: id,
  };
}