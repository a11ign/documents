---
"@a11ign/documents": patch
---

The repository now holds the package at its root instead of under `packages/pdf` (a11ign/a11ign#4212, ADR 0043): one `package.json`, one `README.md`, no workspace file. What a consumer's `import "@a11ign/documents"` sees does not change: the same three exports and the same types. The package manifest's `repository.directory` field is gone because the package is the repository.
