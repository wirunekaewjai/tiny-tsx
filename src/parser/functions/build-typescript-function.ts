import type { Content } from "../types/content";
import type { FunctionParam } from "../types/param";
import type { Struct, StructProperty } from "../types/struct";
import { toLowerSnakeCase } from "./to-lower-snake-case";

function getType(input: string) {
  switch (input) {
    case "i8":
    case "i16":
    case "i32":
    case "i64":
    case "u8":
    case "u16":
    case "u32":
    case "u64":
    case "f8":
    case "f16":
    case "f32":
    case "f64":
      return "number";

    default:
      return input;
  }
}

function buildInterfaceProperty(property: StructProperty) {
  return `  ${property.name}: ${getType(property.type)};`;
}

function buildInterfaces(structs: Struct[]) {
  const items = structs.map((struct) => {
    const properties = struct.properties.map(buildInterfaceProperty);
    return `export interface ${struct.name} {\n${properties.join("\n")}\n}\n`;
  });

  const suffix = items.length > 0 ? "\n" : "";
  return items.join("\n") + suffix;
}

function buildParams(params: FunctionParam[]) {
  const items = params.map((param) => {
    return `${param.name}: ${getType(param.type)}`;
  });

  return `(${items.join(", ")})`;
}

function buildContent(content: Content) {
  let text = content.text;

  content.args.forEach((arg) => {
    if (arg.type === "Identifier" || arg.type === "Expression") {
      text = text.replace(arg.id, "${" + arg.value + "}");
    }

    // TemplateLiteral always inside ObjectExpression | ArrayExpression
    else if (arg.type === "TemplateLiteral") {
      text = text.replace(arg.id, `"${buildContent(arg.value)}"`);
    }

    else {
      text = text.replace(arg.id, `\${esc_quot(\`${buildContent(arg.value)}\`)}`);
    }
  });

  return text;
}

function buildImports(content: string) {
  const lines: string[] = [];

  if (content.includes("esc_quot(")) {
    lines.push(`import { esc_quot } from "@wirunekaewjai/tiny-tsx/macro";\n`);
  }

  const suffix = lines.length > 0 ? "\n" : "";
  return lines.join("\n") + suffix;
}

export function buildTypescriptFunction(fileName: string, namespace: string, props: {
  structs: Struct[];
  params: FunctionParam[];
  content: Content;
}) {
  const content = buildContent(props.content);
  const name = `${namespace}${toLowerSnakeCase(fileName)}`;
  const body = `export const ${name} = ${buildParams(props.params)} => \`${content}\`;\n`;

  const imps = buildImports(content);
  const infs = buildInterfaces(props.structs);

  return imps + infs + body;
}