# 战斗按钮

## 基本介绍

战斗按钮系统允许模组制作者在战斗界面中添加自定义的战斗动作，包括攻击、防御、特殊技能、互动选项等。每个按钮可以有自己的显示条件、效果、颜色和难度提示。

_可通过 `maplebirch.combat.CombatAction.reg` 或 `maplebirchFrameworks.addAction` 来注册战斗按钮。_

---

## 重要限制

### actionType 限制

actionType 只能是以下预设值之一：

| 类型           | 说明     | 对应部位 |
| -------------- | -------- | -------- |
| `leftaction`   | 左手动作 | 左手     |
| `rightaction`  | 右手动作 | 右手     |
| `feetaction`   | 脚部动作 | 脚       |
| `mouthaction`  | 嘴部动作 | 嘴       |
| `penisaction`  | 阴茎动作 | 阴茎     |
| `vaginaaction` | 阴道动作 | 阴道     |
| `anusaction`   | 肛门动作 | 肛门     |
| `chestaction`  | 胸部动作 | 胸部     |
| `thighaction`  | 大腿动作 | 大腿     |

### combatType 限制

combatType 只能是以下预设值之一：

| 类型       | 说明             |
| ---------- | ---------------- |
| `Default`  | 默认战斗类型     |
| `Self`     | 自我战斗(自慰等) |
| `Struggle` | 挣扎战斗         |
| `Swarm`    | 群战             |
| `Vore`     | 吞噬战斗         |
| `Machine`  | 机械战斗         |
| `Tentacle` | 触手战斗         |

---

## 注册战斗按钮

### 基本语法

```javascript
// 注册单个战斗按钮
maplebirch.combat.CombatAction.reg({
  id: "custom_attack",
  actionType: "leftaction",
  cond: (ctx) => V.player.health > 0 && V.player.hasWeapon,
  display: (ctx) => (V.player.weaponType === "sword" ? "剑击" : "攻击"),
  value: "customAttack",
  color: "white",
  difficulty: "简单",
  combatType: "Default",
  order: 0,
});

// 注册多个战斗按钮
maplebirch.combat.CombatAction.reg(
  {
    id: "defensive_stance",
    actionType: "rightaction",
    cond: (ctx) => V.player.stamina >= 20,
    display: "防御姿态",
    value: "defensiveStance",
    color: "blue",
    difficulty: "中等",
    combatType: "Default",
  },
  {
    id: "healing_potion",
    actionType: "mouthaction",
    cond: (ctx) => V.player.inventory.healing_potion > 0,
    display: (ctx) => `治疗药水 (剩余: ${V.player.inventory.healing_potion})`,
    value: "useHealingPotion",
    color: "green",
    difficulty: "容易",
    combatType: "Default",
  },
);
```

### 按钮配置结构

```javascript
{
  id: string,                          // 唯一标识符
  actionType: string,                  // 必须是预设的 actionType
  cond: (ctx) => boolean,              // 显示条件函数
  display: string | (ctx) => string,   // 显示文本
  value: any,                          // 按钮对应的值
  color?: string | (ctx) => string,    // 颜色
  difficulty?: string | (ctx) => string, // 难度提示
  combatType?: string | (ctx) => string, // 必须是预设的 combatType
  order?: number | (ctx) => number     // 显示顺序
}
```

---

## 颜色系统

### 内置颜色

- `white`, `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`
- `gray`, `silver`, `gold`
- `def`: 防御色, `meek`: 温和色, `sub`: 服从色, `brat`: 顽皮色

### 动态颜色

```javascript
maplebirch.combat.CombatAction.reg({
  id: "desperate_escape",
  actionType: "anusaction",
  cond: (ctx) => V.player.health <= 30,
  display: "绝望逃脱",
  value: "desperateEscape",
  color: (ctx) => {
    if (V.player.health <= 10) return "red";
    if (V.player.health <= 20) return "orange";
    return "yellow";
  },
  difficulty: "生命值越低成功率越高",
  combatType: "Default",
  order: 0,
});
```

---

## 完整示例

### 魔法师战斗按钮

```javascript
maplebirch.tool.onInit(() => {
  maplebirch.combat.CombatAction.reg({
    id: "fireball",
    actionType: "rightaction",
    cond: (ctx) => V.player.class === "mage" && V.player.mana >= 25,
    display: (ctx) => `火球术 (消耗 25 魔力)`,
    value: "fireball",
    color: (ctx) => (V.player.mana >= 25 ? "orange" : "gray"),
    difficulty: "对单个敌人造成高额火焰伤害",
    combatType: "Default",
    order: 1,
  });

  maplebirch.combat.CombatAction.reg({
    id: "frost_nova",
    actionType: "leftaction",
    cond: (ctx) => V.player.class === "mage" && V.player.mana >= 40,
    display: (ctx) => `冰霜新星 (消耗 40 魔力)`,
    value: "frostNova",
    color: (ctx) => (V.player.mana >= 40 ? "lightblue" : "gray"),
    difficulty: "冻结所有敌人一回合",
    combatType: "Default",
    order: 2,
  });

  maplebirch.combat.CombatAction.reg({
    id: "magic_shield",
    actionType: "chestaction",
    cond: (ctx) => V.player.class === "mage" && V.player.mana >= 20,
    display: (ctx) => `魔法护盾 (消耗 20 魔力)`,
    value: "magicShield",
    color: (ctx) => (V.player.mana >= 20 ? "blue" : "gray"),
    difficulty: "吸收下三次攻击的伤害",
    combatType: "Default",
    order: 0,
  });
});
```
