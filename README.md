# documents

The documents layer: it reads a document's own accessibility structure directly, with no browser, no screen reader and no
fleet. Moved here from [`a11ign/a11ign`](https://github.com/a11ign/a11ign) with its history (`packages/pdf`).

| | |
|---|---|
| [`packages/pdf`](packages/pdf) | `@a11ign/documents`, **Apache-2.0**. Reads a PDF's tag tree: tagged or untagged, the document language, alt text on figures. See its README. |

## Working here

```bash
pnpm install --frozen-lockfile
pnpm test         # what the `gate` check runs on every pull request and merge-queue entry
pnpm run smoke    # packs the package and runs it from the tarball, outside this repository
```

`main` takes pull requests only, each with one approving review, through the merge queue.

## Releasing

This repository releases on its own, not with `a11ign/a11ign`. A change that should reach npm carries a changeset
(`pnpm exec changeset`), and **its merge to `main` is the release**: `.github/workflows/release.yml` calls the one reusable
per-merge workflow in `a11ign/toolchain`, which versions on a detached commit, publishes, tags and releases. There is no version
pull request (`.changeset/README.md`). The publish uses npm trusted publishing over OIDC with provenance and no stored token.

The root [`LICENSE`](LICENSE) is the package's, byte for byte.
