# Mod protection & credentials

From **v3.2.3** onward the core exposes **`maplebirch.credential`** (`CredentialVault`) for storing unlock material in IndexedDB, verifying auth payloads, and providing **guard digests** when your packager expects them. It complements ModLoader’s SideLazyLoad / encryption flow; it does not replace ModLoader’s encryption by itself.

## Tooling

- **[dol-mod-protection-tools](https://github.com/MaplebirchLeaf/dol-mod-protection-tools)** — companion utilities to build and maintain protected mods, prompts, and metadata.
- **ModLoader docs** — see [Mod encryption](/ml/advanced/mod-encryption) for SideLazyLoad, `tryInitWaitingLazyLoadMod`, and related loader concepts.

## Typical flow (conceptual)

1. After IndexedDB is ready (e.g. `:idbReady`), call `maplebirch.credential.prompt(modName, authConfig)` when you need player-facing unlock UI (SweetAlert2 and other deps apply—check upstream sources).
2. Use `unlock`, `readPassword`, `guard`, etc. to validate credentials or derive digests for your protection pipeline.

For exact shapes (`AuthConfig`, `AuthPayload`, …) follow the TypeScript definitions in [SCML-DOL-maplebirchFramework](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework) (`src/services/CredentialVault.ts`) and the release notes.
