import type { TSExpressionWithTypeArguments } from "@babel/types";

export function parseInterfaceDeriveds(deriveds: TSExpressionWithTypeArguments[] | null | undefined): string[] {
  const items: string[] = [];

  deriveds?.forEach((derived) => {
    const expr = derived.expression;

    if (expr.type === "Identifier") {
      items.push(expr.name);
    }

    else {
      throw `${__filename}: ${JSON.stringify(expr)}`;
    }
  });

  return items;
}