---
---

`@a11ign/documents` counts its `.js`/`.mjs`/`.cjs` source against a committed baseline (`mjs-ratchet.baseline.json`) through `@a11ign/toolchain/mjs-ratchet` (a11ign/a11ign#4266, ADR 0043). A test and a JSON file: nothing a consumer could call changes, so no package is named and no release is cut.
