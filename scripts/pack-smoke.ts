// command: pack @a11ign/documents and run it from the tarball, outside this repository
// A package that works in the workspace and fails when installed is the failure a first publish cannot take back, and it is
// invisible to a workspace install: an `exports` entry that points at a `dist` file nobody packed resolves here and nowhere
// else. So this packs what `pnpm publish` would send (`prepack` builds it), installs that tarball into an empty directory
// with npm, the way a consumer does, and runs the package's own `isolation-smoke.ts`, which imports it BY NAME. That file runs under `tsx`: the consumer directory has
// no TypeScript of its own and the host's Node strips no types (ADR 0043 Decision 8), so the loader is the repository's, named by URL.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const PACKAGE_DIR = resolve(".");
const run = (command: string, args: string[], cwd: string) =>
  execFileSync(command, args, { cwd, stdio: "inherit" });

const scratch = mkdtempSync(join(tmpdir(), "documents-pack-smoke-"));
try {
  run("pnpm", ["pack", "--pack-destination", scratch], PACKAGE_DIR);
  const tarball = readdirSync(scratch).find((file) => file.endsWith(".tgz"));
  if (!tarball) throw new Error(`pnpm pack left no tarball in ${scratch}`);
  writeFileSync(join(scratch, "package.json"), JSON.stringify({ name: "consumer", private: true, type: "module" }));
  run("npm", ["install", "--no-audit", "--no-fund", join(scratch, tarball)], scratch);
  copyFileSync(join(PACKAGE_DIR, "isolation-smoke.ts"), join(scratch, "isolation-smoke.ts"));
  run(process.execPath, ["--import", import.meta.resolve("tsx"), "isolation-smoke.ts"], scratch);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
