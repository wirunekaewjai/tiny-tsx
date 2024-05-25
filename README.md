# Install
1. import runtime to project tsconfig
  
  ```jsxImportSource: "@wirunekaewjai/tiny-tsx/src/jsx"```

2. create templates folder
3. create tsconfig for templates
4. include types.d.ts to tsconfig

  ```include: ["node_modules/@wirunekaewjai/tiny-tsx/src/types.d.ts"]```

---

# Example 1
```ts
// example-1.tsx
(src: string, width: i32) => (
  <img
    alt="this is image"
    src={src}
    width={width}
  />
);
```

```ts
// output of example-1.tsx in Typescript
export const example_1 = (src: string, width: number) => `<img alt="this is image" src="${src}" width="${width}">`;
```

```ts
// usage in Typescript
import { example_1 } from "./outputs/example-1.tsx";

function main() {
    const html = example_1("/favicon.ico", 32);
    console.log(html);
}
```

```rust
// output of example-1.tsx in Rust
pub fn example_1(src: &str, width: i32) -> String {
    return format!(
        r#"<img alt="this is image" src="{}" width="{}">"#,
        src, width
    );
}
```

```rust
// usage in Rust
mod example_1;

pub use example_1::*;

fn main() {
    let html = example_1("/favicon.ico", 32);
    println!(html);
}
```