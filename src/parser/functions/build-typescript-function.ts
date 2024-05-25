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
  const isArray = property.type.endsWith("[]");
  const parsedType = isArray ? getType(property.type.slice(0, -2)) : getType(property.type);
  const wrappedType = isArray ? `${parsedType}[]` : parsedType;

  return `  ${property.name}: ${wrappedType};`;
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
    const isArray = param.type.endsWith("[]");
    const parsedType = isArray ? getType(param.type.slice(0, -2)) : getType(param.type);
    const wrappedType = isArray ? `${parsedType}[]` : parsedType;

    return `${param.name}: ${wrappedType}`;
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

    else if (arg.type === "ObjectExpression" || arg.type === "ArrayExpression") {
      text = text.replace(arg.id, `\${tsx_quot(\`${buildContent(arg.value)}\`)}`);
    }

    else if (arg.type === "MacroMap") {
      text = text.replace(arg.id, `\${tsx_map(${arg.value.items}, (${arg.value.item}) => \`${buildContent(arg.value.content)}\`)}`);
    }

    else if (arg.type === "MacroQuot") {
      text = text.replace(arg.id, `\${tsx_quot(${arg.value})}`);
    }

    else {
      throw `${__filename}: ${JSON.stringify(arg)}`;
    }
  });

  return text;
}

function buildImports(content: string) {
  const uses: string[] = [];

  if (content.includes("tsx_map(")) {
    uses.push("tsx_map");
  }

  if (content.includes("tsx_quot(")) {
    uses.push("tsx_quot");
  }

  if (uses.length === 0) {
    return "";
  }

  return `import { ${uses.join(", ")} } from "@wirunekaewjai/tiny-tsx/macro";\n\n`;
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