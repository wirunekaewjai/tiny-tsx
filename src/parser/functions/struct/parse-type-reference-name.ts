import type { TSEntityName } from "@babel/types";

export function parseTypeReferenceName(entity: TSEntityName): string {
  if (entity.type === "Identifier") {
    return entity.name;
  }

  throw `${__filename}: ${JSON.stringify(entity)}`;
}