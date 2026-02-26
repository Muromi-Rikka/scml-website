# GUI 控制与设置

GUIControl 服务负责框架的设置面板，通过 ModLoaderGui 的 AngularJS 组件系统实现。设置数据持久化到 IndexedDB。

## 设置面板

框架通过 `ModSubUiAngularJs` 注册了一个 AngularJS 组件 `maplebirch-control-component`，在 ModLoader 的设置页面中显示。

### 面板功能

- **语言切换** — 在 EN/CN 之间切换框架语言
- **调试模式** — 启用/禁用 DEBUG 日志级别
- **模块管理** — 启用/禁用扩展模块（仅调试模式可见）
- **脚本管理** — 启用/禁用 Mod 脚本（仅调试模式可见）
- **清除数据库** — 重置 IndexedDB（仅调试模式可见）

### 操作说明

| 操作 | 说明 |
|------|------|
| 切换语言 | 选择下拉菜单中的语言，立即生效并持久化 |
| 启用调试 | 点击「Enable 调试模式」，日志级别变为 DEBUG |
| 禁用调试 | 点击「Disable 调试模式」，日志级别恢复为 INFO |
| 禁用模块 | 在启用列表中选择模块，点击「禁用模块」，重启后生效 |
| 启用模块 | 在禁用列表中选择模块，点击「启用模块」，重启后生效 |

### 级联依赖

禁用模块时，依赖该模块的其他模块会被级联禁用。启用模块时，该模块依赖的其他已禁用模块会被级联启用。

## IndexedDB 持久化

框架使用 IndexedDB 作为设置存储后端，数据库名称为 `maplebirch`。

### 核心服务

`IndexedDBService`（通过 `maplebirch.idb` 访问）提供以下功能：

#### 注册存储

```js
maplebirch.idb.register('my-store', { keyPath: 'id' }, [
  { name: 'indexName', keyPath: 'field', options: { unique: false } }
]);
```

存储注册应在 `:IndexedDB` 事件中完成：

```js
maplebirch.once(':IndexedDB', () => {
  maplebirch.idb.register('my-store', { keyPath: 'id' });
});
```

#### 事务操作

```js
// 读取数据
const value = await maplebirch.idb.withTransaction(
  ['my-store'],
  'readonly',
  async (tx) => {
    return await tx.objectStore('my-store').get('key');
  }
);

// 写入数据
await maplebirch.idb.withTransaction(
  ['my-store'],
  'readwrite',
  async (tx) => {
    await tx.objectStore('my-store').put({ id: 'key', value: 'data' });
  }
);
```

#### 其他方法

| 方法 | 说明 |
|------|------|
| `init()` | 初始化数据库（自动在首次事务时调用） |
| `clearStore(name)` | 清空指定存储 |
| `deleteDatabase()` | 删除整个数据库 |
| `resetDatabase()` | 删除并重建数据库（会刷新页面） |
| `checkStore()` | 检查所有注册的存储是否存在 |

### 内置存储

框架注册了以下 IndexedDB 存储：

| 存储名 | 用途 | 注册者 |
|--------|------|--------|
| `settings` | 全局设置（语言、调试、模块/脚本启禁） | GUIControl |
| `audio-buffers` | 音频文件缓存 | AudioManager |
| `language-metadata` | 翻译文件元数据（哈希、时间戳） | LanguageManager |
| `language-translations` | 翻译键值对 | LanguageManager |
| `language-text_index` | 翻译文本反向索引 | LanguageManager |

### settings 存储键

| 键 | 默认值 | 说明 |
|----|--------|------|
| `DEBUG` | `false` | 是否启用调试模式 |
| `Language` | 自动检测 | 当前语言（EN/CN） |
| `Extension` | `{ enabled: [...], disabled: [] }` | 扩展模块启禁状态 |
| `Script` | `{ enabled: [...], disabled: [] }` | 脚本启禁状态 |
