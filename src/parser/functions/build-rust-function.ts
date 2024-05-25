import type { Content } from "../types/content";
import type { FunctionParam } from "../types/param";
import type { Struct, StructProperty } from "../types/struct";
import { toLowerSnakeCase } from "./to-lower-snake-case";

function getStructType(input: string) {
  switch (input) {
    case "boolean":
      return "bool";

    case "string":
      return "String";

    default:
      return input;
  }
}

function getParamType(input: string) {
  switch (input) {
    case "boolean":
      return "bool";

    case "string":
      return "&str";

    default:
      return input;
  }
}

function buildInterfaceProperty(property: StructProperty) {
  return `    pub ${property.name}: ${getStructType(property.type)},`;
}

function buildInterfaces(structs: Struct[]) {
  const items = structs.map((struct) => {
    const properties = struct.properties.map(buildInterfaceProperty);
    return `pub struct ${struct.name} {\n${properties.join("\n")}\n}\n`;
  });

  const suffix = items.length > 0 ? "\n" : "";
  return items.join("\n") + suffix;
}

function buildParams(params: FunctionParam[]) {
  const items = params.map((param) => {
    return `${param.name}: ${getParamType(param.type)}`;
  });

  return `(${items.join(", ")})`;
}

function buildContentObject(content: Content) {
  const args: string[] = [];

  let text = content.text;

  content.args.forEach((arg) => {
    text = text.replace(arg.id, "{}");

    if (arg.type === "Identifier" || arg.type === "Expression") {
      args.push(arg.value);
    }

    else if (arg.type === "TemplateLiteral") {
      args.push(buildContent(arg.value));
    }

    else {
      args.push(buildContentObject(arg.value));
    }
  });

  return `esc_quot(format!(r#"{${text}}"#, ${args.join(", ")}))`;
}

function buildContent(content: Content) {
  const args: string[] = [];

  let text = content.text;

  content.args.forEach((arg) => {
    text = text.replace(arg.id, "{}");

    if (arg.type === "Identifier" || arg.type === "Expression") {
      args.push(arg.value);
    }

    else if (arg.type === "TemplateLiteral") {
      args.push(buildContent(arg.value));
    }

    else if (arg.type === "ObjectExpression") {
      args.push(buildContentObject(arg.value));
    }

    else {
      args.push(`esc_quot(${buildContent(arg.value)})`);
    }
  });

  return `format!(r#"${text}"#, ${args.join(", ")})`;
}

function buildImports(content: string) {
  const lines: string[] = [];

  if (content.includes("esc_quot(")) {
    lines.push(`use tiny_tsx::esc_quot;\n`);
  }

  const suffix = lines.length > 0 ? "\n" : "";
  return lines.join("\n") + suffix;
}

export function buildRustFunction(fileName: string, namespace: string, props: {
  structs: Struct[];
  params: FunctionParam[];
  content: Content;
}) {
  const content = buildContent(props.content);
  const name = `${namespace}${toLowerSnakeCase(fileName)}`;
  const body = `pub fn ${name}${buildParams(props.params)} -> String {\n    return ${content};\n}\n`;

  const uses = buildImports(content);
  const strs = buildInterfaces(props.structs);

  return uses + strs + body;
}