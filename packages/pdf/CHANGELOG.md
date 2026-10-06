# @a11ign/documents

## 0.1.1

### Patch Changes

- 39e73ad: The package is built with Rslib and its tests run on rstest, both through `@a11ign/toolchain` (a11ign/a11ign ADR 0043). What a consumer's `import "@a11ign/documents"` sees does not change: the same three exports and the same types. The published entry file changes from `dist/index.js` to `dist/index.mjs` (the `exports` map carries it, so nothing that imported by name moves, and the package was never reachable by a deep `dist/index.js` path); `dist/index.d.ts` stays. `dist` no longer ships the `.js.map`, `.d.ts.map` and `.js` files `tsc --build` wrote. A patch, not a minor: nothing a consumer could call is added, removed or changed.

## 0.1.0

### Minor Changes

- 0144474: The first release of `@a11ign/documents`: the PDF layer's tag-tree reader (`scanPdfTagTree`, `pdfFindingsFromBytes`, `looksLikePdfUrl`), moved out of `a11ign/a11ign` (where it was `packages/pdf`, never published) with its history, relicensed Apache-2.0, and published from this repository by npm trusted publishing over OIDC with provenance and no stored token.
