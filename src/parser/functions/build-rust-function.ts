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

    case "number":
      return "f64";

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

    case "number":
      return "f64";

    default:
      return input;
  }
}

function buildInterfaceProperty(property: StructProperty) {
  const isArray = property.type.endsWith("[]");
  const parsedType = isArray ? getStructType(property.type.slice(0, -2)) : getStructType(property.type);
  const wrappedType = isArray ? `Vec<${parsedType}>` : parsedType;

  return `    pub ${property.name}: ${wrappedType},`;
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
    const isArray = param.type.endsWith("[]");
    const parsedType = isArray ? getParamType(param.type.slice(0, -2)) : getParamType(param.type);
    const wrappedType = isArray ? `Vec<${parsedType}>` : parsedType;

    return `${param.name}: ${wrappedType}`;
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

    else if (arg.type === "ObjectExpression") {
      args.push(buildContentObject(arg.value));
    }

    else if (arg.type === "ArrayExpression") {
      args.push(`esc_quot(&${buildContent(arg.value)})`);
    }

    else if (arg.type === "CallExpressionMapJSXElement") {
      args.push(`map(${arg.value.items}, &|${arg.value.item}| ${buildContent(arg.value.content)})`);
    }

    else {
      throw `${__filename}: ${JSON.stringify(arg)}`;
    }
  });

  return `esc_quot(&format!(r#"{${text}}"#, ${args.join(", ")}))`;
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

    else if (arg.type === "ArrayExpression") {
      args.push(`esc_quot(&${buildContent(arg.value)})`);
    }

    else if (arg.type === "CallExpressionMapJSXElement") {
      args.push(`map(${arg.value.items}, &|${arg.value.item}| ${buildContent(arg.value.content)})`);
    }

    else {
      throw `${__filename}: ${JSON.stringify(arg)}`;
    }
  });

  return `format!(r#"${text}"#, ${args.join(", ")})`;
}

function buildImports(content: string) {
  const lines: string[] = [];

  if (content.includes("esc_quot(")) {
    lines.push(`use tiny_tsx::esc_quot;\n`);
  }

  if (content.includes("map(")) {
    lines.push(`use tiny_tsx::map;\n`);
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