import Parser from "@babel/parser";
import type { File } from "@babel/types";
import path from "node:path";
import type { Config } from "../types/config";
import type { Content } from "../types/content";
import { buildRustFunction } from "./build-rust-function";
import { buildTypescriptFunction } from "./build-typescript-function";
import { parseBodyExpression } from "./content/parse-body-expression";
import { parseArrowFunctionParam } from "./param/parse-arrow-function-param";
import { parseInterfaceDeclaration } from "./struct/parse-interface-declaration";

export async function build(filePath: string, file: Parser.ParseResult<File>, config: Config) {
  const namespace = config.namespace ?? "";
  const name = path.parse(filePath).name;

  const content: Content = {
    args: [],
    text: "",
  };

  const body = file.program.body;
  const declarations = body.filter((stmt) => stmt.type === "TSInterfaceDeclaration");
  const statement = body.find((stmt) => stmt.type === "ExpressionStatement");

  if (statement) {
    const expr = statement.expression;

    if (expr.type === "ArrowFunctionExpression") {
      const structs = declarations.map((d) => parseInterfaceDeclaration(name, d));
      const params = expr.params.map((p) => parseArrowFunctionParam(name, p));
      const res = parseBodyExpression(expr.body);

      content.args.push(...res.args);
      content.text += res.text;

      if (config.ext === ".ts") {
        return buildTypescriptFunction(name, namespace, {
          structs,
          params,
          content,
        });
      }

      if (config.ext === ".rs") {
        return buildRustFunction(name, namespace, {
          structs,
          params,
          content,
        });
      }
    }

    else {
      const res = parseBodyExpression(expr);

      content.args.push(...res.args);
      content.text += res.text;

      if (config.ext === ".ts") {
        return buildTypescriptFunction(name, namespace, {
          structs: [],
          params: [],
          content,
        });
      }

      if (config.ext === ".rs") {
        return buildRustFunction(name, namespace, {
          structs: [],
          params: [],
          content,
        });
      }
    }
  }

  throw `${__filename}: ${filePath}`;
}