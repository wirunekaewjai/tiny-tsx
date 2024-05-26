import type { Content } from "../types/content";
import type { FunctionParam } from "../types/param";
import type { Struct, StructProperty } from "../types/struct";
import { toLowerSnakeCase } from "./to-lower-snake-case";

function getDerivePath(input: string) {
  switch (input) {
    case "Serialize":
      return "serde::Serialize";

    default:
      return null;
  }
}

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

function getParamType(input: string, isArray: boolean) {
  switch (input) {
    case "boolean":
      return "bool";

    case "string":
      return isArray ? "String" : "&str";

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

function buildInterfaceDeriveds(deriveds: string[]) {
  const items: string[] = [];

  deriveds.forEach((d) => {
    const p = getDerivePath(d);

    if (p) {
      items.push(p);
    }
  });

  if (items.length === 0) {
    return "";
  }

  return `#[derive(${items.join(", ")})]\n`;
}

function buildInterfaces(structs: Struct[]) {
  const items = structs.map((struct) => {
    const derive = buildInterfaceDeriveds(struct.deriveds);
    const properties = struct.properties.map(buildInterfaceProperty);
    return `${derive}pub struct ${struct.name} {\n${properties.join("\n")}\n}\n`;
  });

  const suffix = items.length > 0 ? "\n" : "";
  return items.join("\n") + suffix;
}

function buildParams(params: FunctionParam[]) {
  const items = params.map((param) => {
    const isArray = param.type.endsWith("[]");
    const parsedType = isArray ? getParamType(param.type.slice(0, -2), true) : getParamType(param.type, false);
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
      args.push(`tsx_quot(&${buildContent(arg.value)})`);
    }

    else if (arg.type === "MacroJoin") {
      args.push(`tsx_join(&${arg.value})`);
    }

    else if (arg.type === "MacroJson") {
      if (arg.value.pretty) {
        args.push(`tsx_json_pretty(&${arg.value.item})`);
      }

      else {
        args.push(`tsx_json(&${arg.value.item})`);
      }
    }

    else if (arg.type === "MacroMap") {
      args.push(`tsx_map(&${arg.value.items}, &|${arg.value.item}| ${buildContent(arg.value.content)})`);
    }

    else if (arg.type === "MacroQuot") {
      args.push(`tsx_quot(&${arg.value})`);
    }

    else {
      throw `${__filename}: ${JSON.stringify(arg)}`;
    }
  });

  return `tsx_quot(&format!(r#"{${text}}"#, ${args.join(", ")}))`;
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
      args.push(`tsx_quot(&${buildContent(arg.value)})`);
    }

    else if (arg.type === "MacroJoin") {
      args.push(`tsx_join(&${arg.value})`);
    }

    else if (arg.type === "MacroJson") {
      if (arg.value.pretty) {
        args.push(`tsx_json_pretty(&${arg.value.item})`);
      }

      else {
        args.push(`tsx_json(&${arg.value.item})`);
      }
    }

    else if (arg.type === "MacroMap") {
      args.push(`tsx_map(&${arg.value.items}, &|${arg.value.item}| ${buildContent(arg.value.content)})`);
    }

    else if (arg.type === "MacroQuot") {
      args.push(`tsx_quot(&${arg.value})`);
    }

    else {
      throw `${__filename}: ${JSON.stringify(arg)}`;
    }
  });

  return `format!(r#"${text}"#, ${args.join(", ")})`;
}

function buildImports(content: string) {
  const uses: string[] = [];

  if (content.includes("tsx_join(")) {
    uses.push("tsx_join");
  }

  if (content.includes("tsx_json_pretty(")) {
    uses.push("tsx_json_pretty");
  }

  if (content.includes("tsx_json(")) {
    uses.push("tsx_json");
  }

  if (content.includes("tsx_map(")) {
    uses.push("tsx_map");
  }

  if (content.includes("tsx_quot(")) {
    uses.push("tsx_quot");
  }

  if (uses.length === 0) {
    return "";
  }

  if (uses.length === 1) {
    return `use tiny_tsx::${uses[0]};\n\n`;
  }

  return `use tiny_tsx::{${uses.join(", ")}};\n\n`;
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