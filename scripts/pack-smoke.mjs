// @ts-check
// command: pack @a11ign/documents and run it from the tarball, outside this repository
// A package that works in the workspace and fails when installed is the failure a first publish cannot take back, and it is
// invisible to a workspace install: an `exports` entry that points at a `dist` file nobody packed resolves here and nowhere
// else. So this packs what `pnpm publish` would send (`prepack` builds it), installs that tarball into an empty directory
// with npm, the way a consumer does, and runs the package's own `isolation-smoke.mjs`, which imports it BY NAME.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const PACKAGE_DIR = resolve("packages/pdf");
const run = (/** @type {string} */ command, /** @type {string[]} */ args, /** @type {string} */ cwd) =>
  execFileSync(command, args, { cwd, stdio: "inherit" });

const scratch = mkdtempSync(join(tmpdir(), "documents-pack-smoke-"));
try {
  run("pnpm", ["pack", "--pack-destination", scratch], PACKAGE_DIR);
  const tarball = readdirSync(scratch).find((file) => file.endsWith(".tgz"));
  if (!tarball) throw new Error(`pnpm pack left no tarball in ${scratch}`);
  writeFileSync(join(scratch, "package.json"), JSON.stringify({ name: "consumer", private: true, type: "module" }));
  run("npm", ["install", "--no-audit", "--no-fund", join(scratch, tarball)], scratch);
  copyFileSync(join(PACKAGE_DIR, "isolation-smoke.mjs"), join(scratch, "isolation-smoke.mjs"));
  run("node", ["isolation-smoke.mjs"], scratch);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
