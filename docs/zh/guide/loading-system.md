# 核心加载系统

## 加载流程概览

Mod 加载由 `SC2DataManager.startInit()` 调用 `ModLoader.loadMod()` 发起，总体分为以下几个阶段：

1. 从指定来源读取 Mod 的 zip 文件
2. 执行 `scriptFileList_inject_early` 和 `scriptFileList_earlyload`，并执行复杂的加载触发逻辑
3. 注册 Mod 到 Addon
4. 重建 `tw-storydata` 节点
5. 执行 `scriptFileList_preload`
6. 启动 SugarCube2 正常执行过程

## 加载来源与优先级

ModLoader 从四个来源加载 Mod，按顺序为：

| 顺序 | 来源 | 说明 |
|------|------|------|
| 1 | HTML 内嵌 (local) | 通过 `insert2html` 打包进 HTML 的 Mod |
| 2 | 远程服务器 (remote) | Web 服务器上 `modList.json` 指定的 Mod |
| 3 | localStorage | 通过浏览器 localStorage 旁加载（有大小限制） |
| 4 | IndexedDB | 通过 IndexedDB 旁加载（玩家上传的主要途径） |

**覆盖规则**：如果同名 Mod 存在于多个来源，后加载的覆盖先加载的。即 remote 覆盖 local，IndexedDB 覆盖 remote + local。

## 详细加载步骤

以下是完整的 Mod 加载流程（共 21 步）：

### 第一阶段：读取与注入

**1.** 按照 local → remote → localStorage → IndexDB 的顺序加载 Mod。同时调用 `DependenceChecker.checkFor()` 执行依赖检查（参见[依赖检查](./dependency-checking)）。

**2.** 使用 `ModZipReader` 读取 Mod 中的 `boot.json` 文件，解析 Mod 的结构声明。

**3.** 调用 `initModInjectEarlyLoadInDomScript()` 将所有 `scriptFileList_inject_early` 的 JS 文件直接注入到 HTML 中，由浏览器按 `<script>` 标签标准方式执行。Mod 应在此处完成自身初始化。

:::warning
`inject_early` 阶段只能执行同步操作，不会等待异步操作完成。
:::

在此过程中，已加载的 Mod 可以通过注册 `ModLoadControllerCallback.canLoadThisMod` 钩子来决定后续 Mod 是否允许加载（安全模式就是由 ModLoaderGui 通过此钩子实现的）。

**4.** 触发以下钩子，通知所有 Mod 当前 Mod 已加载：
- `AddonPluginHookPoint.afterInjectEarlyLoad`
- `ModLoadControllerCallback.afterModLoad`
- `AddonPluginHookPoint.afterModLoad`

此处的钩子调用会等待异步操作完成，适合需要异步初始化的场景。

### 第二阶段：EarlyLoad 执行

**5.** 调用 `initModEarlyLoadScript()` 执行所有 `scriptFileList_earlyload` 中的脚本。使用 `JsPreloader.JsRunner()` 执行，它将代码包装为 `(async () => { return ${jsCode} })()` 并等待异步调用完成。

:::tip
由于添加了 `return` 指令，只会执行 JS 文件第一行的代码或从第一行开始的闭包函数。建议将 earlyload 脚本写成一个立即执行的异步闭包。
:::

**6.** 在 `initModEarlyLoadScript()` 执行过程中，不断调用 `tryInitWaitingLazyLoadMod()` 检查是否有 Mod 追加了需要懒加载的 Mod，并加载这些 Mod。加密 Mod 就是利用懒加载特性在此阶段解密并释放。

**7.** 懒加载的 Mod 在此处读取到 zip 文件后，其 `scriptFileList_inject_early` 和 `scriptFileList_earlyload` 会同时执行，并在此过程中不断触发 `canLoadThisMod` 钩子。

**8.** 完成所有 Mod 的 JS 脚本加载和执行后，触发 `AddonPluginHookPoint.afterEarlyLoad` 钩子。

### 第三阶段：Addon 注册

**9.** 调用 `registerMod2Addon()` 将所有在 `boot.json` 中声明了 `addonPlugin` 的 Mod 注册到对应的 Addon Mod。

:::info
Addon Mod 必须在此之前（即在 EarlyLoad 阶段或更早）调用 `AddonPluginManager.registerAddonPlugin` 将自身注册为 Addon。
:::

**10.** Addon Mod 通过 `AddonPluginHookPointExMustImplement.registerMod` 回调收到 Mod 注册通知，可以据此执行记录或操作。

**11.** 触发 `AddonPluginHookPoint.afterRegisterMod2Addon` 钩子。

**12.** 至此，Mod 的 JS 功能加载完成。

### 第四阶段：数据合并

**13.** 触发 `AddonPluginHookPoint.beforePatchModToGame` 钩子。

**14.** 将所有 Mod 的 `styleFileList`、`scriptFileList`、`tweeFileList` 数据合并到 `tw-storydata` 节点中，重建该节点。

**15.** 触发 `AddonPluginHookPoint.afterPatchModToGame` 钩子。`TweeReplacer`、`ReplacePatch` 等 Mod 在此处执行替换计算。

### 第五阶段：Preload 与启动

**16.** `ModLoader.loadMod()` 执行结束，返回 SC2 代码。

**17.** SC2 代码调用 `JsPreloader.startLoad()`。

**18.** 执行 `scriptFileList_preload` 中的文件。

**19.** 触发 `AddonPluginHookPoint.afterPreload` 钩子。

**20.** 触发 `ModLoadControllerCallback.ModLoaderLoadEnd` 回调——这是 ModLoader 加载过程中的**最后一个**钩子事件。Mod 可在此完成 SC2 启动前的最终收尾工作。

**21.** Mod 加载全部完成，ModLoader 启动完毕，SugarCube2 正常运行流程开始。此后 ModLoader 的所有动作均由 SugarCube2 触发。

## Mod 数据合并规则

在合并阶段，Mod 数据按以下规则处理：

1. Mod 按照 Mod 列表中的顺序加载，靠后的 Mod 会**覆盖**靠前 Mod 的同名 Passage
2. Mod 之间的同名 CSS/JS 文件会将内容 **concat（拼接）** 在一起，不会互相覆盖
3. 先计算 Mod 之间的合并结果，再将结果覆盖到原游戏的同名 Passage/JS/CSS 上
