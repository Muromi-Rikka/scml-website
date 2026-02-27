# 战斗反应

## 基本介绍

异装和双性对话系统允许模组制作者为 NPC 添加看到玩家异装(crossdress)或双性(herm)特征时的特殊反应对话。这些反应会在特定条件下触发，每个 NPC 对每种类型只能触发一次。

_可通过 `maplebirch.combat.Reaction` 访问反应对话功能。_

---

## 注册反应对话

### 基本语法

```javascript
// 注册单个反应
maplebirch.combat.Reaction.regReaction("herm", "Luna", {
  texts: {
    CN: {
      s: "单人文本(NPC数量为1时)",
      m: "多人文本(NPC数量>1时)",
    },
    EN: {
      s: "Single text (when 1 NPC)",
      m: "Multiple text (when >1 NPC)",
    },
  },
  before: "<<run someSetup()>>",
  affter: "<<set $lunaArousal += 20>>",
});

// 使用函数动态生成文本
maplebirch.combat.Reaction.regReaction("crossdress", "Draven", {
  texts: (lang, single) => {
    if (lang === "CN") {
      return single ? "单人文本" : "多人文本";
    } else {
      return single ? "Single text" : "Multiple text";
    }
  },
  affter: () =>
    V.player.charisma >= 15 ? "<<set $dravenIntrigued = true>>" : "<<set $dravenDisgusted = true>>",
});
```

### 配置结构

```javascript
{
  texts: TextsType,                    // 必须：对话文本
  before?: string | (() => string),    // 可选：触发前执行的内容
  affter?: string | (() => string)     // 可选：触发后执行的内容
}
```

### 低层注册 API

```javascript
// 使用 reg 方法直接注册
maplebirch.combat.Reaction.reg(
  "herm",
  "CustomNPC",
  () => {
    return V.player.isHerm && !V.customnpcSeen.includes("herm") && V.encounterType === "special";
  },
  () => {
    V.customnpcSeen.pushUnique("herm");
    return `<<set $customnpcArousal += 25>><<set $speechhermaroused to 2>><span class="purple">自定义NPC对你的双性特征表现出浓厚兴趣。</span>`;
  },
);
```

---

## 完整示例

```javascript
// 注册精灵NPC的双性反应
maplebirch.combat.Reaction.regReaction("herm", "ElvenQueen", {
  before: '<<set _queenMood = V.elfReputation >= 50 ? "accepting" : "disdainful">>',
  texts: (lang, single) => {
    const mood = V._queenMood;

    if (lang === "CN") {
      if (mood === "accepting") {
        return single
          ? '精灵女王好奇地看着你的双性特征。"自然界的奇妙变异，"她微笑着说。'
          : '精灵女王好奇地看着你的双性特征。"自然界的奇妙变异，"她微笑着说。';
      } else {
        return single
          ? '精灵女王轻蔑地瞥了一眼。"畸形，"她冷冷地说。'
          : '精灵女王轻蔑地瞥了一眼。"畸形，"她冷冷地说。';
      }
    } else {
      if (mood === "accepting") {
        return single
          ? 'The Elven Queen looks curiously at your herm features. "A fascinating mutation of nature," she says with a smile.'
          : 'The Elven Queen looks curiously at your herm features. "A fascinating mutation of nature," she says with a smile.';
      } else {
        return single
          ? 'The Elven Queen glances dismissively. "Malformation," she says coldly.'
          : 'The Elven Queen glances dismissively. "Malformation," she says coldly.';
      }
    }
  },
  affter: () => {
    if (V._queenMood === "accepting") {
      return "<<set $elfReputation += 10>><<set $speechhermaroused to 2>>";
    } else {
      return "<<set $elfReputation -= 20>><<set $queenDispleased = true>>";
    }
  },
});
```
