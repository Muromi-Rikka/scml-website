# NPC 侧边栏

## 基本介绍

NPC 侧边栏系统允许模组制作者为自定义 NPC 添加侧边栏显示功能，包括静态图片显示和基于游戏内服装系统的动态模型渲染。

---

## 侧边栏显示模式

### 两种显示模式

1. **静态图片模式**: 显示预先绘制的 NPC 静态图片
2. **动态模型模式**: 基于游戏内服装系统动态渲染 NPC 模型

---

## 静态图片模式

### 图片放置位置

```
img/ui/nnpc/[npc_name]/[image_name].[png|jpg|gif]
```

**路径说明**:

- `[npc_name]`: NPC 名称(小写，如：luna, draven)
- `[image_name]`: 图片名称，将在游戏中作为显示选项

例如：

```
img/ui/nnpc/luna/default.png
img/ui/nnpc/luna/happy.png
img/ui/nnpc/luna/angry.png
```

当 `boot.json` 中注册了 `luna` 后，以上图片会自动作为侧边栏可选图片。

---

## 在 boot.json 中配置

### 基本结构

```json
{
  "params": {
    "npc": {
      "Sidebar": {
        "image": ["luna", "draven"]
      }
    }
  }
}
```

### 完整示例

```json
{
  "params": {
    "npc": {
      "Sidebar": {
        "image": ["Elara", "Merlin", "Draven"],
        "clothes": ["data/npc/elven_clothes.yaml", "data/npc/wizard_wardrobe.json"],
        "config": ["data/npc/elara_sidebar.yaml", "data/npc/merlin_sidebar.json"]
      }
    }
  }
}
```

### 配置字段说明

| 字段      | 类型     | 说明                                                       |
| --------- | -------- | ---------------------------------------------------------- |
| `image`   | string[] | 静态侧边栏 NPC，读取 `img/ui/nnpc/<npcName>/` 目录中的图片 |
| `clothes` | string[] | 动态模型模式使用的 NPC 服装配置                            |
| `config`  | string[] | 动态模型图层配置 (YAML/JSON)                               |

---

## 配置文件示例

### 侧边栏图层配置 (YAML)

```yaml
# data/npc/elara_sidebar.yaml
- name: "Elara" # NPC名称，需要与NPC系统中的ID一致
  body: "img/npc/elara/body.png" # 基础身体图片，所有图层的基础

  # 头部图层
  head:
    # 头发图层
    - { img: "img/npc/elara/hair.png", zIndex: auto } # auto 表示自动计算图层顺序
    # 耳朵图层
    - { img: "img/npc/elara/ears.png", zIndex: 7 }

  # 面部图层
  face:
    # 默认表情
    - { img: "img/npc/elara/face_default.png", zIndex: 10 }
    # 条件图层：当NPC心情为 shy 或 happy 时显示
    - {
        img: "img/npc/elara/blush.png",
        zIndex: 12,
        cond: "C.npc.Elara.mood === 'shy' || C.npc.Elara.mood === 'happy'",
      }

  # 上半身服装
  upper:
    # 当NPC穿 elven_robe 时显示
    - {
        img: "img/npc/elara/top_default.png",
        zIndex: 15,
        cond: "maplebirch.npc.Clothes.worn('Elara').upper.name === 'elven_robe'",
      }

  # 下半身服装
  lower:
    # 当NPC穿 elven_skirt 时显示
    - {
        img: "img/npc/elara/skirt_default.png",
        zIndex: 10,
        cond: "maplebirch.npc.Clothes.worn('Elara').lower.name === 'elven_skirt'",
      }
```

**说明**：

- `body` 为基础层
- `head / face / upper / lower` 为逻辑图层组
- `zIndex` 控制图层叠放顺序，可使用 `auto` 表示自动计算
- `cond` 为条件表达式，返回 `true` 时图层才会渲染

---

### 侧边栏图层配置 (JSON)

```json
[
  {
    "name": "Elara",
    "body": "img/npc/elara/body.png",
    "head": [
      { "img": "img/npc/elara/hair.png", "zIndex": "auto" },
      { "img": "img/npc/elara/ears.png", "zIndex": 7 }
    ],
    "face": [
      { "img": "img/npc/elara/face_default.png", "zIndex": 10 },
      {
        "img": "img/npc/elara/blush.png",
        "zIndex": 12,
        "cond": "C.npc.Elara.mood === 'shy' || C.npc.Elara.mood === 'happy'"
      }
    ],
    "upper": [
      {
        "img": "img/npc/elara/top_default.png",
        "zIndex": 15,
        "cond": "maplebirch.npc.Clothes.worn('Elara').upper.name === 'elven_robe'"
      }
    ],
    "lower": [
      {
        "img": "img/npc/elara/skirt_default.png",
        "zIndex": 10,
        "cond": "maplebirch.npc.Clothes.worn('Elara').lower.name === 'elven_skirt'"
      }
    ]
  }
]
```

---

### 服装配置文件 (YAML)

以下为简化示例，用于快速定义服装套装。完整的动态模型服装配置基于游戏原始服装结构，需包含各 slot（如 `over_upper`、`upper`、`lower` 等）的完整属性定义。

```yaml
# data/npc/elven_clothes.yaml
elven_robes:
  upper: { name: "elven_robe", colour: "silver" }
  lower: { name: "elven_skirt", colour: "forest_green" }
  head: { name: "silver_tiara" }

hunting_gear:
  upper: { name: "leather_vest", colour: "brown" }
  lower: { name: "riding_pants", colour: "dark_brown" }
  head: { name: "leather_hood" }

# NPC服装注册
Elara:
  forest: "elven_robes"
  hunting_grounds:
    key: "hunting_gear"
    cond: "V.time.hour >= 6 && V.time.hour <= 18"
  "*": "elven_robes" # 默认服装
```

---

## 完整配置示例

```
fantasyMod/
├── img/
│   └── ui/
│       └── nnpc/
│           ├── elara/
│           │   ├── portrait.png
│           │   ├── casual.png
│           │   └── formal.png
│           └── draven/
│               ├── default.png
│               └── armored.png
├── data/
│   └── npc/
│       ├── elara_sidebar.yaml
│       ├── draven_sidebar.yaml
│       └── elven_clothes.yaml
└── boot.json
```
