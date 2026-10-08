# @a11ign/documents

## 0.1.2

### Patch Changes

- 2bc631d: The repository now holds the package at its root instead of under `packages/pdf` (a11ign/a11ign#4212, ADR 0043): one `package.json`, one `README.md`, no workspace file. What a consumer's `import "@a11ign/documents"` sees does not change: the same three exports and the same types. The package manifest's `repository.directory` field is gone because the package is the repository.

## 0.1.0

### Minor Changes

- 0144474: The first release of `@a11ign/documents`: the PDF layer's tag-tree reader (`scanPdfTagTree`, `pdfFindingsFromBytes`, `looksLikePdfUrl`), moved out of `a11ign/a11ign` (where it was `packages/pdf`, never published) with its history, relicensed Apache-2.0, and published from this repository by npm trusted publishing over OIDC with provenance and no stored token.
