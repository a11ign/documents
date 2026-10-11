## What

A throwaway pull request for a11ign/a11ign#5065's done-when 2: it is based on `agent/a11ign-documents-a-pull-5065` and omits `@changesets/cli` from `pnpm-lock.yaml`'s importer entry, so `release-dry-run` must be RED on it. It is never merged: its base is that branch, not `main`.

Acceptance: grep -q "release-dry-run:" .github/workflows/ci.yml
