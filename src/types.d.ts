export declare global {
  export type i8 = number;
  export type i16 = number;
  export type i32 = number;
  export type i64 = number;

  export type u8 = number;
  export type u16 = number;
  export type u32 = number;
  export type u64 = number;

  export type f8 = number;
  export type f16 = number;
  export type f32 = number;
  export type f64 = number;

  export declare function quot(item: string): string;
  export declare function map<T>(items: T[], render: (item: T) => object | string): string;
}