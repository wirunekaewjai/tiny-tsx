export declare global {
  export type i8 = number;
  export type i16 = number;
  export type i32 = number;
  export type i64 = number;

  export type u8 = number;
  export type u16 = number;
  export type u32 = number;
  export type u64 = number;

  export type f32 = number;
  export type f64 = number;

  /** derive serde::Serialize in Rust */
  export type Serialize = {};

  /** join array to string */
  export declare function join<T>(items: T[]): string;

  /** JSON stringify + escape quote for html rendering */
  export declare function json_pretty<T extends Serialize>(value: T): string;
  export declare function json<T extends Serialize>(value: T): string;

  /** render array and join to string */
  export declare function map<T>(items: T[], render: (item: T) => object | string): string;

  /** replace double quote with &quot; */
  export declare function quot(item: string): string;
}