export interface Struct {
  name: string;
  properties: StructProperty[];
  deriveds: string[];
}

export interface StructProperty {
  name: string;
  type: string;
}