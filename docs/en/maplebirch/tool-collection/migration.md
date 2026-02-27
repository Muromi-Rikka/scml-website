# Data Migration (migration)

The `migration` tool handles save data changes during version upgrades. It is used directly by the Variables module.

_Access via `maplebirch.tool.migration` or shortcut `maplebirchFrameworks.migration()`._

## Core API

### Creating an Instance

```js
const Migration = maplebirch.tool.migration;
const m = new Migration();

// Or via create()
const migrator = maplebirch.tool.migration.create();
```

### add(fromVersion, toVersion, migrationFn)

Add a migration step from source version to target version.

```js
m.add("1.0.0", "2.0.0", (data, utils) => {
  utils.rename(data, "oldField", "newField");
});
```

### run(data, targetVersion)

Execute all migration steps from current version to target version.

```js
m.run(targetData, targetVersion);
```

## Example

```js
const Migration = maplebirch.tool.migration;
const m = new Migration();

// Add migration rule
m.add("1.0.0", "2.0.0", (data) => {
  if (data.oldField) {
    data.newField = data.oldField;
    delete data.oldField;
  }
});

// Execute migration
m.run(targetData, targetVersion);
```
