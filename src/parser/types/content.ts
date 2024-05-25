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
  ContentArgCallExpressionMapJSXElement;

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

export interface ContentArgCallExpressionMapJSXElement {
  type: "CallExpressionMapJSXElement";
  id: string;
  value: {
    items: string;
    item: string;
    content: Content;
  };
}