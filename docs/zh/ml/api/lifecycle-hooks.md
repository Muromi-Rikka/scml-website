# 生命周期钩子参考

ModLoader 在加载过程的各个阶段提供钩子（Hook），Mod 可以注册回调函数来响应特定事件。

## AddonPluginHookPoint

这些钩子由 AddonPlugin 系统提供，Addon Mod 可以注册以响应加载过程中的各个事件。

| 钩子                     | 触发时机                               | 说明                                        |
| ------------------------ | -------------------------------------- | ------------------------------------------- |
| `afterInjectEarlyLoad`   | 每个 Mod 的 `inject_early` 脚本执行后  | 通知 Addon 某个 Mod 的早期注入已完成        |
| `afterModLoad`           | 每个 Mod 加载后                        | 通知 Addon 某个 Mod 已加载完毕              |
| `afterEarlyLoad`         | 所有 Mod 的 `earlyload` 脚本执行完成后 | 所有 Mod 的 JS 加载和执行已完成             |
| `afterRegisterMod2Addon` | 所有 Mod 注册到 Addon 之后             | Mod 到 Addon 的注册全部完成                 |
| `beforePatchModToGame`   | 数据合并到 `tw-storydata` 之前         | 即将开始合并 Mod 数据到游戏                 |
| `afterPatchModToGame`    | 数据合并到 `tw-storydata` 之后         | Mod 数据已合并，TweeReplacer 等在此执行替换 |
| `afterPreload`           | `preload` 脚本执行完成后               | preload 阶段结束                            |

## AddonPluginHookPointExMustImplement

这些是 Addon Mod **必须实现**的接口方法。

| 方法          | 说明                                              |
| ------------- | ------------------------------------------------- |
| `registerMod` | 接收普通 Mod 的注册回调，Addon 据此记录或执行操作 |

## ModLoadController 详解

`ModLoadController` 是 ModLoader 的加载控制器，负责协调 Mod 的加载流程并允许 Mod 参与加载决策。通过注册 `ModLoadControllerCallback`，Mod 可以：

- **控制是否加载某个 Mod**：通过 `canLoadThisMod` 在 inject_early 执行前决定是否允许加载
- **响应 ModLoader 完成**：通过 `ModLoaderLoadEnd` 在加载全部完成后执行收尾逻辑

### 安全模式实现

ModLoader 的**安全模式**由 ModLoaderGui 通过 `canLoadThisMod` 实现。若 ModLoader 连续三次加载失败，下次启动时 ModLoaderGui 会通过 `canLoadThisMod` 返回 `false` 阻止所有 Mod 加载，让用户能够正常打开 Mod 管理器并卸载导致故障的 Mod。

### 懒加载与 tryInitWaitingLazyLoadMod

ModLoader 在 earlyload 执行过程中会不断调用 `tryInitWaitingLazyLoadMod()` 检查是否有 Mod 追加了**懒加载 Mod**。加密 Mod 利用此机制：在 earlyload 阶段解密后，将解密后的 Mod zip 通过 SideLazyLoad API 注入到 ModLoader 的加载队列中，ModLoader 会立即加载这些懒加载 Mod，并执行其 inject_early 和 earlyload 脚本。

## ModLoadControllerCallback

由 `ModLoadController` 提供的回调接口，用于控制 Mod 加载行为。

| 回调               | 触发时机                          | 说明                                     |
| ------------------ | --------------------------------- | ---------------------------------------- |
| `canLoadThisMod`   | 每个 Mod 的 `inject_early` 执行前 | 返回是否允许加载该 Mod（用于安全模式等） |
| `afterModLoad`     | 每个 Mod 加载后                   | 通知控制器 Mod 已加载                    |
| `ModLoaderLoadEnd` | ModLoader 加载全部完成            | **最后一个钩子**，Mod 可在此完成最终收尾 |

## 钩子触发顺序

以下是完整的钩子触发顺序，对应加载系统的 21 个步骤：

```
对每个 Mod 循环 {
  canLoadThisMod           → 检查是否允许加载
  [执行 inject_early]
  afterInjectEarlyLoad     → inject_early 完成
  afterModLoad (Controller) → Mod 加载完成（控制器回调）
  afterModLoad (Addon)      → Mod 加载完成（Addon 回调）
  [执行 earlyload]
  [检查懒加载 Mod]
}

afterEarlyLoad             → 所有 Mod 的 earlyload 完成
[registerMod2Addon]        → 注册 Mod 到 Addon
  registerMod              → Addon 收到注册通知
afterRegisterMod2Addon     → 注册完成

beforePatchModToGame       → 即将合并数据
[合并 style/script/twee]
afterPatchModToGame        → 数据合并完成（替换器在此工作）

[执行 preload]
afterPreload               → preload 完成
ModLoaderLoadEnd           → ModLoader 加载全部完成

[SugarCube2 正常启动]
```

## 异步支持

以下钩子**支持异步**操作（会等待返回的 Promise 完成）：

- `afterInjectEarlyLoad`
- `afterModLoad`
- `afterEarlyLoad`
- `afterPreload`
- `ModLoaderLoadEnd`

以下钩子**仅支持同步**操作：

- `canLoadThisMod`（必须立即返回布尔值）

:::tip
如果 Mod 需要在非常早期执行异步初始化，应在 `afterInjectEarlyLoad` 或 `afterModLoad` 钩子中进行。如果某个操作必须在所有其他 Mod 最后执行，应在 `ModLoaderLoadEnd` 中进行。
:::
