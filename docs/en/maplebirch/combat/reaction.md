# Combat Reaction

## Overview

The crossdress and herm reaction system lets mod authors add NPC dialogue that triggers when the player is crossdressing or has herm features. Reactions fire under set conditions; each NPC can trigger at most once per type.

_Access via `maplebirch.combat.Reaction`._

---

## Registering Reactions

### Basic Syntax

```javascript
// Single reaction
maplebirch.combat.Reaction.regReaction("herm", "Luna", {
  texts: {
    CN: {
      s: "Single NPC text",
      m: "Multiple NPCs text",
    },
    EN: {
      s: "Single text (when 1 NPC)",
      m: "Multiple text (when >1 NPC)",
    },
  },
  before: "<<run someSetup()>>",
  affter: "<<set $lunaArousal += 20>>",
});

// Dynamic text via function
maplebirch.combat.Reaction.regReaction("crossdress", "Draven", {
  texts: (lang, single) => {
    if (lang === "CN") {
      return single ? "Single text" : "Multiple text";
    } else {
      return single ? "Single text" : "Multiple text";
    }
  },
  affter: () =>
    V.player.charisma >= 15 ? "<<set $dravenIntrigued = true>>" : "<<set $dravenDisgusted = true>>",
});
```

### Config Shape

```javascript
{
  texts: TextsType,                    // Required: dialogue text
  before?: string | (() => string),    // Optional: run before trigger
  affter?: string | (() => string)    // Optional: run after trigger
}
```

### Low-level API

```javascript
maplebirch.combat.Reaction.reg(
  "herm",
  "CustomNPC",
  () => {
    return V.player.isHerm && !V.customnpcSeen.includes("herm") && V.encounterType === "special";
  },
  () => {
    V.customnpcSeen.pushUnique("herm");
    return `<<set $customnpcArousal += 25>><<set $speechhermaroused to 2>><span class="purple">The custom NPC shows strong interest in your herm features.</span>`;
  },
);
```

---

## Full Example

```javascript
// Herm reaction for an elven NPC
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
