# 命名 NPC 系统

NPCManager 模块提供完整的命名 NPC 注册、数据管理、侧边栏渲染、服装系统和日程安排功能。

## NPC 注册

### 基本注册

通过 `maplebirch.npc.add()` 注册一个命名 NPC：

```js
maplebirch.npc.add(
  // NPCData - NPC 基础数据
  {
    nam: 'MyNPC',
    gender: 'f',
    title: 'shopkeeper',
    description: '商店老板',
    type: 'human',
    adult: 1,
    eyeColour: 'green',
    hairColour: 'brown',
    breastsize: 3,
    outfits: ['femaleDefault']
  },
  // NPCConfig - NPC 配置
  {
    love: { maxValue: 100 },
    loveAlias: ['好感', 'Affection'],
    important: true,
    loveInterest: true,
    romance: [() => V.mynpcRomance === 1]
  },
  // Translations - 翻译数据（可选）
  {
    'MyNPC': { EN: 'MyNPC', CN: '我的NPC' }
  }
);
```

### NPCData 接口

| 字段 | 类型 | 说明 |
|------|------|------|
| `nam` | `string` | NPC 名称（必须） |
| `gender` | `'m' \| 'f' \| 'h' \| 'n' \| 'none'` | 性别 |
| `pronoun` | `'m' \| 'f' \| 'i' \| 'n' \| 't'` | 代词类型 |
| `title` | `string` | 头衔 |
| `description` | `string` | 描述 |
| `type` | `string` | 种族类型 |
| `adult` / `teen` | `number` | 成人/青少年标记 |
| `eyeColour` | `string` | 眼睛颜色 |
| `hairColour` | `string` | 头发颜色 |
| `breastsize` | `number` | 胸部大小 |
| `penissize` | `number` | 阴茎大小 |
| `bottomsize` | `number` | 臀部大小 |
| `ballssize` | `number` | 睾丸大小 |
| `outfits` | `string[]` | 服装列表 |
| `pregnancy` | `object` | 怀孕数据 |

未指定的字段将使用随机或默认值。

### NPCConfig 接口

| 字段 | 类型 | 说明 |
|------|------|------|
| `love` | `{ maxValue: number }` | 好感度上限 |
| `loveAlias` | `[string, string] \| () => string` | 好感度别名（CN/EN） |
| `important` | `boolean \| () => boolean` | 是否为重要 NPC |
| `special` | `boolean \| () => boolean` | 是否为特殊 NPC |
| `loveInterest` | `boolean \| () => boolean` | 是否可成为恋爱对象 |
| `romance` | `(() => boolean)[]` | 恋爱条件函数列表 |

## 代词系统

框架内置了完整的代词映射，支持中英双语：

| 代词类型 | 说明 | he(EN) | he(CN) |
|---------|------|--------|--------|
| `m` | 男性 | he | 他 |
| `f` | 女性 | she | 她 |
| `i` | 非人 | it | 它 |
| `n` | 中性 | they | 她 |
| `t` | 复数 | they | 他们 |

每种代词类型包含 `he`、`his`、`hers`、`him`、`himself`、`man`、`boy`、`men` 等完整映射。

## 自定义属性

通过 `addStats()` 注册自定义 NPC 属性：

```js
maplebirch.npc.addStats({
  trust: {
    maxValue: 100,
    position: 'last'  // 'first', 'last', 或数字索引
  }
});
```

自定义属性会自动添加到所有 NPC 上（默认值为 0）。

## 怀孕系统

框架自动处理 NPC 的怀孕系统初始化。根据 NPC 名称和类型，系统会：

- 不育 NPC（如 Bailey、Leighton）不会被初始化
- 支持的种族类型：`human`、`wolf`、`wolfboy`、`wolfgirl`、`hawk`、`harpy`
- 特定 NPC（Alex、Black Wolf、Great Hawk）默认可怀孕

## NPC 侧边栏

NPCSidebar 子模块负责 NPC 的侧边栏模型渲染，支持多图层配置：

- `base_layers` — 基础身体图层
- `face_layers` — 面部图层
- `head_layers` — 头部图层
- `upper_layers` — 上半身图层
- `lower_layers` — 下半身图层
- `legs_layers` — 腿部图层
- `feet_layers` — 脚部图层
- `hands_layers` — 手部图层
- `handheld_layers` — 手持物图层
- `neck_layers` — 颈部图层

### 从 Mod 加载图层图片

通过 `boot.json` 的 `npc.Sidebar` 配置加载：

```json
{
  "npc": {
    "Sidebar": {
      "image": ["img/npc/sidebar/"],
      "config": ["npc/sidebar_config.json"],
      "clothes": ["npc/clothes_config.json"]
    }
  }
}
```

图片会自动注册到 BeautySelectorAddon 的图片管线中。

## NPC 服装

NPCClothes 子模块管理 NPC 的服装系统：

```js
maplebirch.npc.addClothes({
  name: 'customOutfit',
  // 服装配置...
});
```

服装配置可以通过 JSON 文件加载，在 `boot.json` 的 `npc.Sidebar.clothes` 中指定路径。

## NPC 日程

NPCSchedules 子模块管理 NPC 的位置日程：

```js
maplebirch.npc.addSchedule(
  'MyNPC',           // NPC 名称
  { hour: 8, minute: 0, endHour: 17, endMinute: 0 },  // 时间条件
  'shop',            // 位置
  'work_schedule',   // 日程 ID
  { priority: 10 }   // 选项
);
```

日程系统支持：
- 基于时间的日程
- 基于条件的日程
- 特殊日程（带优先级）
- 通过 `V.options.maplebirch.npcschedules` 启用/禁用
