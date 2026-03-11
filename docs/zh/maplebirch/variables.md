# 变量与游戏状态

Variables 模块管理框架在 SugarCube2 存档系统中的数据存储，包括 `V.maplebirch` 命名空间和 `V.options.maplebirch` 选项配置。

## V.maplebirch 命名空间

框架使用 `V.maplebirch` 作为统一的变量命名空间，避免与游戏本体和其他 Mod 冲突。

### 默认变量结构

新游戏开始时（`Start2` Passage），`V.maplebirch` 被初始化为：

```js
{
  player: {
    clothing: {}  // V.worn 的只读镜像
  },
  npc: {},
  transformation: {},
  version: "3.2.0"
}
```

:::tip
`V.maplebirch.player.clothing` 是 `V.worn` 的只读代理。直接修改它会触发警告，请使用 `V.worn` 修改玩家装备。
:::

## V.options.maplebirch

选项配置存储在 `V.options.maplebirch` 中，跨存档保持一致。

### 默认选项

```js
{
  character: {
    mask: 0,
    rotation: 0,  // 遮罩旋转角度，范围 -90 ~ 90
    charArt: {
      type: 'fringe',
      select: 'low-ombre',
      value: { fringe: {}, sides: {} }  // 发色渐变位置
    },
    closeUp: {
      type: 'fringe',
      select: 'low-ombre',
      value: { fringe: {}, sides: {} }
    }
  },
  npcsidebar: {
    show: false,
    model: false,
    position: 'back',
    dxfn: -48,
    dyfn: -8,
    skin_type: 'light',
    tan: 0,
    facestyle: 'default',
    facevariant: 'default',
    freckles: false,
    ears: 'back',
    mask: 0,
    rotation: 0,  // 遮罩旋转角度
    nnpc: false,
    display: {}
  },
  relationcount: 4,
  npcschedules: false
}
```

### 选项检查与合并

框架在每次 `:passageend` 和存档加载时执行选项检查。合并策略为深度合并，同时进行类型校验——如果存档中的值类型与默认值不匹配，将使用默认值。

## 变量迁移系统

Variables 模块集成了 `migration` 工具来处理版本升级时的数据迁移。

### 迁移触发时机

- **新游戏**：`Start2` Passage 时初始化默认变量
- **每次 Passage**：`Init()` 阶段检查并运行迁移
- **加载存档**：`loadInit()` 阶段检查并运行迁移
- **后初始化**：如果版本不一致，再次运行迁移

### 使用迁移

```js
const migration = maplebirch.var.migration;

// 注册迁移规则：从旧版本迁移到新版本
migration.add("3.0.0", "3.1.0", (data) => {
  // 迁移逻辑
  if (!data.newField) {
    data.newField = "defaultValue";
  }
});

// 手动运行迁移
migration.run(V.maplebirch, "3.2.0");
```

## 发色渐变

Variables 模块提供了 `hairgradients()` 函数，用于从游戏的 `setup.colours.hairgradients_prototypes` 中提取可用的发色渐变数据：

```js
const gradients = maplebirch.var.hairgradients();
// 返回 { fringe: { styleName: [color1, color2, ...] }, sides: { ... } }
```

该数据用于角色渲染系统的发色渐变配置。
