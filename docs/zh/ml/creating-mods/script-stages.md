# 四个脚本加载阶段

ModLoader 提供四个不同的脚本执行阶段，每个阶段在启动流程中的不同时机运行，可访问的数据和支持的操作各不相同。

## 阶段概览

| 阶段 | boot.json 字段 | 执行时机 | 异步支持 | 可访问数据 |
|------|---------------|---------|---------|-----------|
| inject_early | `scriptFileList_inject_early` | Mod 加载后立即注入 | 仅同步 | 未修改的原始数据 |
| earlyload | `scriptFileList_earlyload` | inject_early 之后 | 支持异步 | 未修改的原始数据 |
| preload | `scriptFileList_preload` | 数据合并到 tw-storydata 之后 | 支持异步 | 合并后的最终数据 |
| 主脚本 | `scriptFileList` | 作为游戏一部分合并 | 随 SC2 执行 | 游戏运行时数据 |

## inject_early

**对应字段**：`scriptFileList_inject_early`

脚本在当前 Mod 加载后**立即**以 `<script>` 标签注入到 HTML 中，由浏览器按标准方式执行。

**特点**：
- 可以调用 ModLoader 的 API
- 可以读取未经修改的 SC2 data（包括原始 Passage）
- **只能执行同步操作**，不会等待异步操作完成
- 适合 Mod 自身的初始化工作（注册 Addon、设置 modRef 等）

**使用场景**：
- 注册 Addon 插件（`registerAddonPlugin`）
- 注册加载控制回调（`canLoadThisMod`）
- 设置 `modRef` 暴露 API

## earlyload

**对应字段**：`scriptFileList_earlyload`

在当前 Mod 的 inject_early 脚本全部插入完成后，由 ModLoader 执行。

**特点**：
- 可以调用 ModLoader 的 API
- 可以执行异步操作（远程加载数据等）
- 可以读取未经修改的 SC2 data（包括原始 Passage）
- 使用 `JsPreloader.JsRunner()` 执行

:::warning 脚本格式要求
`JsPreloader.JsRunner()` 将代码包装为 `(async () => { return ${jsCode} })()`。由于在第一行前添加了 `return`，按 JS 语义只会执行文件第一行的代码或从第一行开始的闭包函数。

推荐写法：
```js
(async () => {
  // 你的 earlyload 代码
  const modName = window.modUtils.getNowRunningModName();
  console.log(`${modName} earlyload`);
})()
```
:::

**使用场景**：
- 需要异步操作的初始化（远程数据加载等）
- 读取和分析原始游戏数据
- 懒加载 Mod 的解密和释放

## preload

**对应字段**：`scriptFileList_preload`

在所有 Mod 的数据文件（CSS/JS/Twee）合并到 `tw-storydata` 之后，SC2 引擎启动之前执行。

**特点**：
- 可以调用 ModLoader 的 API
- 可以执行异步操作
- 可以读取 Mod 应用后的 SC2 data（合并后的最终数据）
- 可以动态修改和覆盖 Passage 内容

:::warning 脚本格式要求
与 earlyload 相同，preload 脚本也使用 `JsPreloader.JsRunner()` 执行，需要遵循相同的格式要求。
:::

**使用场景**：
- 需要基于最终合并数据进行操作
- 动态修改已合并的 Passage
- 最终的数据校验和调整

## scriptFileList（主脚本）

**对应字段**：`scriptFileList`

作为游戏脚本的一部分直接合并到 `tw-storydata` 节点中，在 SC2 引擎启动后作为游戏的一部分执行。

**特点**：
- 与原游戏的 JS 脚本行为完全一致
- 按照 SC2 引擎的标准方式执行
- Mod 之间的同名 JS 文件内容会拼接在一起

**使用场景**：
- 游戏逻辑扩展
- 添加新的游戏功能
- 宏（Macro）定义

## 执行顺序总结

整个过程在加载屏幕（转圈动画）期间完成，之后 SC2 引擎才启动游戏：

```
1. [inject_early]  → 同步注入，初始化
2. [earlyload]     → 异步执行，读取原始数据
3. [数据合并]       → CSS/JS/Twee 合并到 tw-storydata
4. [preload]       → 异步执行，读取合并后数据
5. [SC2 启动]      → scriptFileList 随游戏执行
```
