# Mod Encryption

ModLoader provides a content protection framework based on [libsodium](https://doc.libsodium.org/) since v2.1.0 for Mods that need protection.

## How It Works

Encrypted Mods use ModLoader’s **SideLazyLoad** support:

1. The encrypted Mod is a normal Mod that runs in the `earlyload` stage
2. During earlyload it asks the user for the decryption password (via SweetAlert2Mod dialog)
3. It decrypts the real Mod data with that password
4. It releases the decrypted Mod as a lazily-loaded Mod for ModLoader to load

## Related APIs

### SideLazyLoad API

Introduced in v2.0.0 for Mod encryption. The decryption logic in earlyload injects the decrypted Mod zip into ModLoader’s load queue via this API.

During earlyload, ModLoader repeatedly calls `tryInitWaitingLazyLoadMod()` to pick up new lazy-loaded Mods and load them immediately.

## Reference Implementations

### CryptoI18nMod

[CryptoI18nMod](https://github.com/Lyoko-Jeremie/CryptoI18nMod) is the v2.0.0 encryption demo, using the i18n Mod as a full example.

### SimpleCryptWrapper

[SimpleCryptWrapper](https://github.com/Lyoko-Jeremie/SimpleCryptWrapperMod) is a simple tool that wraps another Mod so it requires a decryption password on load. Mainly for protecting image assets.

## Dependencies

Encrypted Mods typically depend on:

- **SweetAlert2Mod** — Provides dialogs for password input
- **libsodium** — Cryptography library for encryption/decryption

## Notes

:::warning
Mod encryption offers basic protection and cannot stop technically skilled users from bypassing it. It is mainly for preventing casual copying and redistribution of protected content (e.g. beauty images).
:::
