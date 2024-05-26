export interface Content {
  args: ContentArg[];
  text: string;
}

export type ContentArg =
  ContentArgArrayExpression |
  ContentArgIdentifier |
  ContentArgExpression |
  ContentArgObjectExpression |
  ContentArgTemplateLiteral |
  ContentArgMacroJoin |
  ContentArgMacroJson |
  ContentArgMacroMap |
  ContentArgMacroQuot;

export interface ContentArgArrayExpression {
  type: "ArrayExpression";
  id: string;
  value: Content;
}

export interface ContentArgIdentifier {
  type: "Identifier";
  id: string;
  value: string;
}

export interface ContentArgExpression {
  type: "Expression";
  id: string;
  value: string;
}

export interface ContentArgObjectExpression {
  type: "ObjectExpression";
  id: string;
  value: Content;
}

export interface ContentArgTemplateLiteral {
  type: "TemplateLiteral";
  id: string;
  value: Content;
}

export interface ContentArgMacroJoin {
  type: "MacroJoin";
  id: string;
  value: string;
}

export interface ContentArgMacroJson {
  type: "MacroJson";
  id: string;
  value: {
    item: string;
  };
}

export interface ContentArgMacroMap {
  type: "MacroMap";
  id: string;
  value: {
    items: string;
    item: string;
    content: Content;
  };
}

export interface ContentArgMacroQuot {
  type: "MacroQuot";
  id: string;
  value: string;
}
