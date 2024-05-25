import Parser from "@babel/parser";
import type { File } from "@babel/types";
import { $ } from "bun";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import { build } from "./functions/build";
import { cleanup } from "./functions/cleanup";
import { generateRustModules } from "./functions/generate-rust-modules";
import { glob } from "./functions/glob";
import { toLowerSnakeCase } from "./functions/to-lower-snake-case";
import type { Config } from "./types/config";

export async function parse(srcDir: string, configs: Config[]) {
  const startAt = Date.now();
  const srcFilePaths = glob(srcDir, ".tsx");
  const srcData: Record<string, [string, Parser.ParseResult<File>]> = {};

  for (const srcFilePath of srcFilePaths) {
    const input = await Bun.file(path.join(srcDir, srcFilePath)).text();
    const file = Parser.parse(input, {
      sourceType: "module",
      plugins: [
        "jsx",
        "typescript",
      ],
    });

    srcData[srcFilePath] = [input, file];
  }

  for (const config of configs) {
    const outDir = config.dir;
    const outExt = config.ext;

    const isRust = outExt === ".rs";

    for (const srcFilePath of srcFilePaths) {
      const srcPathObj = path.parse(srcFilePath);

      const srcParentPath = srcPathObj.dir;
      const srcFileName = (isRust ? toLowerSnakeCase(srcPathObj.name) : srcPathObj.name) + outExt;

      const outPath = path.join(outDir, srcParentPath, srcFileName);
      const outParentPath = path.dirname(outPath);

      const exists = existsSync(outPath);

      try {
        const data = srcData[srcFilePath];
        const code = await build(srcFilePath, data[1], config);

        if (!code) {
          if (exists) {
            await rm(outPath, {
              force: true,
              recursive: true,
            });

            console.log(styleText("yellow", `- ${outPath}`));
          } else {
            console.log(styleText("gray", `? ${outPath}`));
          }

          continue;
        }

        await mkdir(outParentPath, {
          recursive: true,
        });

        const attach = config.attachOriginal ? `\n/*\n=== original: ${srcFilePath} ===\n\n${data[0]}\n*/` : "";
        const output = "// AUTO GENERATED\n" + code + attach;
        await writeFile(outPath, output, "utf8");

        if (exists) {
          console.log(`* ${outPath}`);
        } else {
          console.log(styleText("green", `+ ${outPath}`));
        }
      } catch (err) {
        console.log(styleText("red", `! ${outPath}`));
        console.log(err);
        console.log();
      }
    }

    if (isRust) {
      await generateRustModules(outDir, startAt);
    }

    if (isRust) {
      await $`rustfmt ${path.join(outDir, "**/*.rs")}`.catch();
    }

    await cleanup(outDir, startAt);

    console.log();
  }
}