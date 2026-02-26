# Dependency Checking

ModLoader runs dependency checks when loading Mods to ensure version constraints in `boot.json`'s `dependenceInfo` are satisfied. Dependency checks are performed by `DependenceChecker` before a Mod is loaded.

## Concepts

### ModOrderContainer

ModLoader uses an internal Mod order container to manage load order. Load order affects:

- Override behavior when Mod names collide (later-loaded overrides earlier)
- Dependency resolution (dependency targets must load before dependents)

Final load order is determined by merging local, remote, localStorage, and IndexedDB lists; DependenceChecker runs when each Mod is loaded.

## Check Flow

For each Mod, ModLoader calls `DependenceChecker.checkFor()` to:

1. **Read boot.json**: Parse the `dependenceInfo` field from the Mod zip
2. **Check each dependency**: Verify target Mod/ModLoader/GameVersion exists and version matches
3. **On failure**: Skip loading the Mod and record an error

## dependenceInfo Declaration

Declare dependencies in `boot.json` via the `dependenceInfo` array:

```json
{
  "name": "MyMod",
  "version": "1.0.0",
  "dependenceInfo": [
    {
      "modName": "TweeReplacer",
      "version": "^2.0.0"
    },
    {
      "modName": "ModLoader",
      "version": "^1.6.0"
    },
    {
      "modName": "GameVersion",
      "version": ">=0.4.2.0"
    }
  ]
}
```

## Dependency Target Types

| modName | Description |
|---------|-------------|
| **Other Mod name** | Dependency on an already-loaded Mod; version must satisfy constraint |
| **ModLoader** | Dependency on ModLoader version |
| **GameVersion** | Dependency on game version (e.g., DoL; requires an adapter like CheckGameVersion) |

## Version Constraint Syntax

Versions follow [Semantic Versioning](https://semver.org/lang/en/) and are validated with [semver](https://www.npmjs.com/package/semver):

| Format | Meaning | Example |
|--------|---------|---------|
| `^x.y.z` | Compatible within same major version (recommended) | `^2.0.0` matches 2.x.x |
| `=x.y.z` or `x.y.z` | Exact match | `=1.2.3` |
| `>x.y.z` | Greater than | `>1.0.0` |
| `>=x.y.z` | Greater or equal | `>=1.0.0` |
| `<x.y.z` | Less than | `<2.0.0` |
| `<=x.y.z` | Less or equal | `<=2.0.0` |

:::tip
For `GameVersion`, only the main version is compared; anything after the first `-` is ignored.
:::

## Notes

- Dependent Mods must load **before** the Mod that depends on them
- If Mod A depends on Mod B and Mod B is not loaded or version is incompatible, Mod A is skipped
- Game version checking needs an adapter Mod (e.g., [CheckGameVersion](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_CheckGameVersion) for DoL)
