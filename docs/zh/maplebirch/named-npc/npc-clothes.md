# NPC 服装

## 基本介绍

NPC 服装系统分为三个独立但相关的子系统，分别处理不同场景下的服装需求：

1. **原版 NPC 服装** (`addClothes`) - 游戏内互动服装
2. **NPC 侧边栏默认服装** (`Sidebar.config`) - NPC 侧边栏显示
3. **NPC 衣柜系统** (`Wardrobe`) - 基于位置和条件的服装切换

_可通过 `maplebirch.npc.addClothes` 或 `maplebirchFrameworks.addNPCClothes` 来注册原版 NPC 服装。_

---

## 原版 NPC 服装系统 (VanillaClothes)

### 用途

处理游戏内的服装互动，如脱衣、检查、损坏等。这些服装会在 NPC 对话、事件和互动中使用。

### 使用方法

```javascript
// 添加原版NPC服装套装
maplebirch.npc.addClothes({
  name: "school_uniform",
  type: "uniform",
  gender: "f",
  upper: {
    name: "school_shirt",
    word: "a",
    action: "lift",
    integrity_max: 100,
  },
  lower: {
    name: "pleated_skirt",
    word: "a",
    action: "lift",
    integrity_max: 100,
  },
  desc: "标准校服，白色衬衫和格子短裙",
});
```

### 存储位置

```javascript
// 存储在 setup.npcClothesSets 数组中
setup.npcClothesSets = [
  {
    name: 'school_uniform',
    type: 'uniform',
    gender: 'f',
    outfit: 0,
    clothes: {
      upper: { name: 'school_shirt', ... },
      lower: { name: 'pleated_skirt', ... }
    },
    desc: '标准校服...'
  }
];
```

---

## NPC 侧边栏默认服装 (Sidebar.config)

### 用途

定义 NPC 在侧边栏显示时的外观。包括身体、头、脸、颈部、上半身、下半身、腿、脚、手等图层的配置。

### 配置格式

支持 JSON 和 YAML 格式：

```yaml
# 侧边栏服装配置 (YAML)
- name: "Luna" # NPC名称
  body: "img/npc/luna/body.png" # 身体基础图片

  # 头部图层(可多个，按顺序渲染)
  head:
    - { img: "img/npc/luna/hair_back.png", zIndex: 5 }
    - { img: "img/npc/luna/face_base.png", zIndex: 10 }
    - { img: "img/npc/luna/hat.png", zIndex: 20, cond: "V.weather === 'rain'" }

  # 上半身服装图层
  upper:
    - {
        img: "img/npc/luna/top_casual.png",
        zIndex: 15,
        cond: "C.npc.Luna.worn.upper.name === 'casual_top'",
      }
    - {
        img: "img/npc/luna/top_formal.png",
        zIndex: 15,
        cond: "C.npc.Luna.worn.upper.name === 'formal_top'",
      }
```

### 在 boot.json 中配置

```json
{
  "params": {
    "npc": {
      "Sidebar": {
        "config": ["data/npc/luna_sidebar.yaml", "data/npc/draven_sidebar.json"]
      }
    }
  }
}
```

### 条件系统

```yaml
# 条件类型示例：
- img: "path/to/image.png"
  cond: true                    # 布尔值 - 始终显示
  cond: "V.time.hour >= 18"     # 字符串表达式
  cond: ["C.npc.Luna.mood === 'happy'", "V.weather === 'sunny'"]  # 数组 - AND 条件
  cond: () => C.npc.Luna.magic_affinity >= 50  # 函数 - 动态判断
```

---

## NPC 衣柜系统 (Wardrobe)

### 用途

根据 NPC 所在位置、时间、事件等条件，动态切换 NPC 的服装。用于模拟 NPC 的日常换装行为。

### 基本概念

- **服装定义**: 定义一套完整的服装
- **位置注册**: 在特定位置穿着特定服装
- **条件控制**: 满足条件时才穿着
- **层级系统**: 位置特定 > 全局默认

### 在 boot.json 中配置

```json
{
  "params": {
    "npc": {
      "Sidebar": {
        "clothes": ["wardrobe.yaml", "wardrobe.json"]
      }
    }
  }
}
```

### 在代码中使用

```javascript
// 1. 加载衣柜配置
await maplebirch.npc.Clothes.load("myMod", "data/wardrobe.yaml");

// 2. 为NPC注册服装
// 在学校位置总是穿校服
maplebirch.npc.Clothes.register("Luna", "school", "school_uniform");

// 在咖啡馆位置穿便服，但只在非工作时间
maplebirch.npc.Clothes.register(
  "Luna",
  "cafe",
  "casual_outfit",
  () => V.time.hour >= 18 || V.time.hour <= 8,
);

// 全局默认(当没有其他匹配时)
maplebirch.npc.Clothes.register("Luna", "*", "casual_outfit");

// 3. 获取当前服装
const currentOutfit = maplebirch.npc.Clothes.worn("Luna");
```
