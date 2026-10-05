---
"@a11ign/documents": patch
---

The package is built with Rslib and its tests run on rstest, both through `@a11ign/toolchain` (a11ign/a11ign ADR 0043). What a consumer's `import "@a11ign/documents"` sees does not change: the same three exports and the same types. The published entry file changes from `dist/index.js` to `dist/index.mjs` (the `exports` map carries it, so nothing that imported by name moves, and the package was never reachable by a deep `dist/index.js` path); `dist/index.d.ts` stays. `dist` no longer ships the `.js.map`, `.d.ts.map` and `.js` files `tsc --build` wrote. A patch, not a minor: nothing a consumer could call is added, removed or changed.
