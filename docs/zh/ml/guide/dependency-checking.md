# 依赖检查

ModLoader 在加载 Mod 时会执行依赖检查，验证 `boot.json` 中 `dependenceInfo` 声明的版本约束是否满足。依赖检查由 `DependenceChecker` 执行，确保 Mod 所需的依赖在加载前已就绪且版本兼容。

## 概念

### ModOrderContainer

ModLoader 内部通过 Mod 顺序容器管理 Mod 的加载顺序。加载顺序影响：

- 同名 Mod 的覆盖关系（后加载的覆盖先加载的）
- 依赖解析顺序（被依赖的 Mod 需要先于依赖它的 Mod 加载）

Mod 的最终加载顺序由各来源（local、remote、localStorage、IndexedDB）合并后的列表决定，DependenceChecker 在加载每个 Mod 时执行校验。

## 校验流程

加载每个 Mod 时，ModLoader 会调用 `DependenceChecker.checkFor()` 执行以下校验：

1. **读取 boot.json**：从 Mod 的 zip 文件中解析 `dependenceInfo` 字段
2. **逐项校验**：对每个依赖声明检查目标 Mod/ModLoader/GameVersion 是否存在且版本满足约束
3. **失败处理**：若任一依赖不满足，该 Mod 会被跳过加载，并记录错误信息

## dependenceInfo 声明

在 `boot.json` 中通过 `dependenceInfo` 数组声明依赖：

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

## 依赖目标类型

| modName           | 说明                                                                |
| ----------------- | ------------------------------------------------------------------- |
| **其他 Mod 名称** | 依赖已加载的 Mod，版本需满足约束                                    |
| **ModLoader**     | 依赖 ModLoader 本体版本                                             |
| **GameVersion**   | 依赖游戏版本（如 DoL 的版本号，需要 CheckGameVersion 等适配器提供） |

## 版本约束语法

版本号遵循[语义化版本控制规范](https://semver.org/lang/zh-CN/)，使用 [semver](https://www.npmjs.com/package/semver) 进行校验：

| 格式                | 含义                   | 示例                |
| ------------------- | ---------------------- | ------------------- |
| `^x.y.z`            | 兼容同一大版本（推荐） | `^2.0.0` 匹配 2.x.x |
| `=x.y.z` 或 `x.y.z` | 精确匹配               | `=1.2.3`            |
| `>x.y.z`            | 大于指定版本           | `>1.0.0`            |
| `>=x.y.z`           | 大于等于               | `>=1.0.0`           |
| `<x.y.z`            | 小于指定版本           | `<2.0.0`            |
| `<=x.y.z`           | 小于等于               | `<=2.0.0`           |

:::tip
对于 `GameVersion`，比较时只取游戏本体版本号，会忽略第一个 `-` 之后的后缀。
:::

## 注意事项

- 依赖的 Mod 必须**先于**当前 Mod 加载
- 若 Mod A 依赖 Mod B，而 Mod B 未加载或版本不兼容，Mod A 会被跳过
- 游戏版本检查需要对应游戏的适配器 Mod（如 [CheckGameVersion](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_CheckGameVersion) 为 DoL 提供）
