/**
 * THIS REPOSITORY COUNTS ITS `.js`/`.mjs`/`.cjs` SOURCE AGAINST A COMMITTED BASELINE (a11ign/a11ign#4266; the check is
 * `@a11ign/toolchain/mjs-ratchet`, a11ign/a11ign#4243). The standard is TypeScript source and `.mjs` only as build output.
 *
 * The real tree is read by walking up from THIS FILE to `mjs-ratchet.baseline.json`, so moving the test (the layout flatten, #4212)
 * edits nothing. The negative controls run on a temporary tree built from the committed baseline, so none of them touches the
 * real one, and the first of them proves the fixture builder itself is sound (a tree that matches its baseline passes).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

test("the repository's real tree passes against the committed baseline", () => {
  assert.equal(real.ok, true, real.message);
  // The positive control: the read found this repository's scripts, so 'ok' is not 'the walk read nothing'.
  assert.ok(real.count > 0, `the ratchet counted ${real.count} files in ${real.root}`);
  assert.equal(real.count, real.baselineCount, "the baseline is a reading of the tree: lower it with writeLoweredBaseline when files are converted");
});

test("a tree that matches its baseline passes (the fixture builder's own control)", () => {
  withTree({ present: committed.files, baseline: committed }, (root) => {
    const result = checkMjsRatchet({ from: root });
    assert.equal(result.ok, true, result.message);
    assert.equal(result.count, committed.files.length);
  });
});

test("a baseline with one name removed fails and names that file", () => {
  const [removed, ...rest] = committed.files;
  withTree({ present: committed.files, baseline: { ...committed, files: rest } }, (root) => {
    const result = checkMjsRatchet({ from: root });
    assert.equal(result.ok, false);
    assert.match(result.message, new RegExp(removed.replace(/\./g, "\\.")), "the failure must name the file the baseline no longer allows");
  });
});

test("a tree holding fewer files than the baseline lists passes and says it can be lowered", () => {
  withTree({ present: committed.files.slice(1), baseline: committed }, (root) => {
    const result = checkMjsRatchet({ from: root });
    assert.equal(result.ok, true, result.message);
    assert.match(result.message, /can be lowered/);
  });
});

test("an exception with no `why` fails", () => {
  const [excepted, ...rest] = committed.files;
  const baseline = { files: rest, exceptions: [{ path: `src/${excepted}` }] };
  withTree({ present: committed.files, baseline }, (root) => {
    const result = checkMjsRatchet({ from: root });
    assert.equal(result.ok, false);
    assert.match(result.message, /why/);
  });
});

test("an exception that carries a `why` is honoured (the control for the one above)", () => {
  const [excepted, ...rest] = committed.files;
  const baseline = { files: rest, exceptions: [{ path: `src/${excepted}`, why: "the tool reads only this name" }] };
  withTree({ present: committed.files, baseline }, (root) => {
    const result = checkMjsRatchet({ from: root });
    assert.equal(result.ok, true, result.message);
  });
});
