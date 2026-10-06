// One `.mjs` and one `.d.ts` per `exports` key, derived from the package's own `exports` map (a11ign/toolchain's
// `libraryPreset`), so a subpath cannot be added to one and forgotten in the other. `tsc` checks and never builds.
import { defineConfig } from "@rslib/core";
import { libraryPreset } from "@a11ign/toolchain/rslib-presets";
import pkg from "./package.json" with { type: "json" };

export default defineConfig(libraryPreset(pkg, { dir: import.meta.dirname }));
