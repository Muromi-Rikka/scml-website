# AddonPlugin 系统

Addon 是一种特殊的 Mod，作为功能扩展的中间层存在。通过将常用功能集中在一个 Mod 中供其他 Mod 调用，避免 ModLoader 本身过于臃肿，同时方便独立更新。

## 设计理念

类似于 RimWorld 中的「身体扩展」「战斗扩展」「发饰扩展」等 Mod，Addon 通过注入和修改游戏并扩展出新功能供其他 Mod 调用。

将功能独立为 Addon 的好处：
- 保持 ModLoader 核心的轻量与通用
- 将特定游戏相关的功能与 SC2 引擎绑定的 ModLoader 分离
- 方便快速更新和升级
- Mod 作者可以 fork 实现更复杂的功能而无需修改 ModLoader

## 注册 Addon

Addon Mod 需要在 `EarlyLoad` 阶段（或 `InjectEarlyLoad` 阶段）调用以下 API 注册自己：

```js
window.modAddonPluginManager.registerAddonPlugin(
  'AddonModName',   // 提供插件的 Mod 名称
  'addonName',      // 插件名称
  addonInstance     // 插件实例（实现了 AddonPluginHookPointEx 接口的对象）
);
```

## 使用 Addon

普通 Mod 在 `boot.json` 的 `addonPlugin` 字段中声明依赖：

```json
{
  "addonPlugin": [
    {
      "modName": "AddonModName",
      "addonName": "addonName",
      "modVersion": "1.0.0",
      "params": []
    }
  ]
}
```

ModLoader 会在 `EarlyLoad` 之后、`PatchModToGame` 之前，将所有声明了 `addonPlugin` 的 Mod 注册到对应的 Addon Mod。

## 注册流程

```
1. Addon Mod 在 EarlyLoad 阶段调用 registerAddonPlugin() 注册自身
     ↓
2. ModLoader 调用 registerMod2Addon() 将普通 Mod 注册到对应 Addon
     ↓
3. Addon Mod 通过 registerMod 回调收到通知
     ↓
4. Addon Mod 根据自身设计执行记录或操作
```

## Addon 示例

### ImageLoaderHook

[ImageLoaderHook](https://github.com/Lyoko-Jeremie/DoL_ImgLoaderHooker) 通过挂钩 DoL 游戏中的图片加载器（`Renderer.ImageLoader`），实现将 Mod 中的图片加载到游戏中。游戏加载图片时会自动读取 Mod 中的替换图片。

### ReplacePatch / TweeReplacer

[ReplacePatch](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_ReplacePatch) 和 [TweeReplacer](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_TweeReplacer) 实现 Passage 和 JS/CSS 的字符串替换功能。大部分需要修改游戏逻辑的 Mod 可以直接使用这两个 Addon 而无需自行编写修改代码。

### CheckDoLCompressorDictionaries

[CheckDoLCompressorDictionaries](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_CheckDoLCompressorDictionaries) 检查 DoL 的数据压缩字典结构，在发现变化后发出警告，提示开发者和用户避免影响存档有效性。
