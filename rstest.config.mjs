// The shared a11ign rstest config (ADR 0043, a11ign/toolchain): `root` and `include` are the whole of it. `include` is the glob the
// old `tsx --test` script handed to `node:test`, so "the same test files run" is checkable against it.
import { defineToolchainConfig } from "@a11ign/toolchain/rstest-config";

export default defineToolchainConfig({
  root: import.meta.dirname,
  include: ["src/**/*.test.ts", "scripts/*.test.ts"],
});
