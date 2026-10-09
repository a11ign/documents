---
---

`@a11ign/documents` has no JavaScript source left (a11ign/a11ign#4281, ADR 0043): `isolation-smoke`, `rslib.config`, `rstest.config` and `scripts/pack-smoke` are TypeScript, converted by `@a11ign/toolchain`'s `js-to-ts`, and `mjs-ratchet.baseline.json` is empty, so the ratchet now fails any new `.js`/`.mjs`/`.cjs` file. `pnpm run smoke` runs under `tsx` (a new devDependency), because the host's Node strips no types and the packed package is checked from a directory with no TypeScript of its own. Nothing a consumer could call changes, so no package is named and no release is cut.
