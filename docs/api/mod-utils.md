# modUtils 参考

`window.modUtils` 是 ModLoader 面向 Mod 开发者的主要公共 API。

## Mod 查询

### getModListName()

获取所有已加载 Mod 的名称列表。

```js
// 返回 string[]
const modNames = window.modUtils.getModListName();
```

### getMod(modName)

通过 Mod 名称获取 Mod 信息对象。

```js
// 找到返回 ModInfo，找不到返回 undefined
const modInfo = window.modUtils.getMod('MyMod');
```

### getModZip(modName)

通过 Mod 名称获取 Mod 的 zip 文件读取器。

```js
// 找到返回 ModZipReader，找不到返回 undefined
const zip = window.modUtils.getModZip('MyMod');
```

### getNowRunningModName()

获取当前正在执行脚本的 Mod 名称。常用于需要代码复用的 Mod 模板中，让 Mod 获取自身名称。

```js
// 如果有 Mod 的 JS 脚本正在运行，返回当前 Mod 名称 string
// 其他情况下返回 undefined
const myName = window.modUtils.getNowRunningModName();
```

## ModLoader 查询 API

以下是 ModLoader 实例上的查询方法，通过 `window.modSC2DataManager` 间接访问。

### ModLoader.getModByNameOne(modName)

使用 Mod 名称查询 Mod 信息。

### ModLoader.getModZip(modName)

使用 Mod 名称查询 Mod 的 zip 文件。

### ModLoader.getModEarlyLoadCache()

在 `EarlyLoad` 阶段安全地读取已加载的 Mod 快照。

:::warning
以下方法**不能**在 `EarlyLoad` 阶段使用。
:::

### ModLoader.getModCacheMap()

以 Map 方式使用 Mod 名称查询，返回 ReadOnlyMap。

### ModLoader.getModCacheOneArray()

以 Array 方式遍历，对返回 Array 的修改不会影响 ModLoader 内部数据。

### ModLoader.getModCacheArray()

获取 Mod 缓存数组。

### ModLoader.getModCacheByNameOne(modName)

通过 Mod 名称查询缓存。

### ModLoader.checkModCacheUniq()

检查数据是否唯一。在手动修改 Mod 数据后应调用此 API 验证。

### ModLoader.checkModCacheData()

检查内部数据一致性。在手动修改 Mod 数据后应调用此 API 验证。

## Mod 间通信：ModInfo.modRef

ModLoader 通过 `ModInfo.modRef` 机制支持 Mod 间的 API 暴露与调用。

### Mod A（先加载）—— 暴露接口

```js
const modAName = window.modUtils.getNowRunningModName();
const modAInfo = window.modUtils.getMod(modAName);

// modRef 默认为 undefined，设置为自定义对象即可暴露 API
modAInfo.modRef = {
  funcA: () => {
    console.log('modA funcA');
  },
  objA: {
    a: 1,
    b: 2,
  }
};
```

### Mod B（后加载）—— 调用接口

```js
const modAInfo = window.modUtils.getMod('Mod A Name');

// 必须先检查 Mod A 是否存在且已注册 modRef
if (modAInfo && modAInfo.modRef) {
  modAInfo.modRef.funcA();
  console.log(modAInfo.modRef.objA);
}
```

:::tip
由于加载顺序的影响，在 `earlyload` 阶段调用其他 Mod 的 `modRef` 时，需要确保目标 Mod 已经加载完成并设置了 `modRef`。建议在 `preload` 阶段或更晚的时机进行 Mod 间通信。
:::
