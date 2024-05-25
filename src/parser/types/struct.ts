export interface Struct {
  name: string;
  properties: StructProperty[];
}

export interface StructProperty {
  name: string;
  type: string;
}