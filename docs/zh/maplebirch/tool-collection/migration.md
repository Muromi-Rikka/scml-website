# 数据迁移（migration）

数据迁移工具用于处理版本升级时的存档数据变更。被 Variables 模块直接使用。

_可通过 `maplebirch.tool.migration` 或快捷接口 `maplebirchFrameworks.migration()` 访问。_

## 核心 API

### 创建实例

```js
const Migration = maplebirch.tool.migration;
const m = new Migration();

// 或使用 create()
const migrator = maplebirch.tool.migration.create();
```

### add(fromVersion, toVersion, migrationFn)

添加从源版本到目标版本的迁移步骤。

```js
m.add("1.0.0", "2.0.0", (data, utils) => {
  utils.rename(data, "oldField", "newField");
});
```

### run(data, targetVersion)

执行从当前版本到目标版本的所有迁移步骤。

```js
m.run(targetData, targetVersion);
```

## 示例

```js
const Migration = maplebirch.tool.migration;
const m = new Migration();

// 注册迁移规则
m.add("1.0.0", "2.0.0", (data) => {
  if (data.oldField) {
    data.newField = data.oldField;
    delete data.oldField;
  }
});

// 执行迁移
m.run(targetData, targetVersion);
```
