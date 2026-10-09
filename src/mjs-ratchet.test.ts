/**
 * THIS REPOSITORY COUNTS ITS `.js`/`.mjs`/`.cjs` SOURCE AGAINST A COMMITTED BASELINE (a11ign/a11ign#4266; the check is
 * `@a11ign/toolchain/mjs-ratchet`, a11ign/a11ign#4243). The standard is TypeScript source and `.mjs` only as build output.
 * THE BASELINE IS EMPTY (a11ign/a11ign#4281): the last slice is converted, so any `.js`/`.mjs`/`.cjs` file added anywhere fails here.
 *
 * The real tree is read by walking up from THIS FILE to `mjs-ratchet.baseline.json`, so moving the test (the layout flatten, #4212)
 * edits nothing. The negative controls run on a temporary tree built from the committed baseline, so none of them touches the
 * real one, and the first of them proves the fixture builder itself is sound (a tree that matches its baseline passes).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { BASELINE_FILE, checkMjsRatchet } from "@a11ign/toolchain/mjs-ratchet";

const here = fileURLToPath(import.meta.url);
const real = checkMjsRatchet({ from: here });
const committed = JSON.parse(readFileSync(join(real.root, BASELINE_FILE), "utf8")) as { files: string[]; exceptions: unknown[] };

/** A throwaway tree (no `.git`, so the check walks it): `present` as empty files under `src/`, and `baseline` written as its baseline. */
function withTree({ present, baseline }: { present: string[]; baseline: object }, body: (root: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), "mjs-ratchet-"));
  try {
    mkdirSync(join(root, "src"));
    for (const name of present) writeFileSync(join(root, "src", name), "");
    writeFileSync(join(root, BASELINE_FILE), JSON.stringify(baseline));
    body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const EMPTY = { files: [], exceptions: [] };

test("the repository's real tree passes against the committed baseline, and the end state is zero", () => {
  assert.equal(real.ok, true, real.message);
  // The positive control: the walk read this repository (its manifest is there and the package source is counted), so 'zero' is not
  // 'the read found nothing'. The ratchet itself calls an empty tree red, and the controls below prove a `.mjs` is seen when one exists.
  assert.ok(existsSync(join(real.root, "package.json")), `no package.json under ${real.root}`);
  assert.deepEqual(committed, EMPTY, "the baseline is the end state: no files and no exceptions");
  assert.equal(real.count, 0, "the repository holds no .js/.mjs/.cjs source");
});

test("a TypeScript-only tree passes against the empty baseline (the fixture builder's own control)", () => {
  withTree({ present: ["index.ts"], baseline: EMPTY }, (root) => {
    const result = checkMjsRatchet({ from: root });
    assert.equal(result.ok, true, result.message);
    assert.equal(result.count, 0);
  });
});

for (const extension of [".js", ".mjs", ".cjs"]) {
  test(`a new ${extension} file fails against the empty baseline and is named`, () => {
    withTree({ present: ["index.ts", `added${extension}`], baseline: EMPTY }, (root) => {
      const result = checkMjsRatchet({ from: root });
      assert.equal(result.ok, false);
      assert.match(result.message, new RegExp(`added${extension.replace(".", "\\.")}`), "the failure must name the file that is not allowed");
    });
  });
}

test("an exception with no `why` fails", () => {
  const baseline = { files: [], exceptions: [{ path: "src/tool.mjs" }] };
  withTree({ present: ["index.ts", "tool.mjs"], baseline }, (root) => {
    const result = checkMjsRatchet({ from: root });
    assert.equal(result.ok, false);
    assert.match(result.message, /why/);
  });
});

test("an exception that carries a `why` is honoured (the control for the one above)", () => {
  const baseline = { files: [], exceptions: [{ path: "src/tool.mjs", why: "the tool reads only this name" }] };
  withTree({ present: ["index.ts", "tool.mjs"], baseline }, (root) => {
    const result = checkMjsRatchet({ from: root });
    assert.equal(result.ok, true, result.message);
  });
});
