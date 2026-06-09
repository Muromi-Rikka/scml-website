# NPC 体液图层

## 基本介绍

NPC 体液图层系统允许模组制作者在 [NPC 侧边栏](./npc-sidebar) 的动态人模上渲染体液效果，包括滴落动画和静态残留。该系统通过 `NPCFluids` 管理体液数据，并在侧边栏中自动应用对应的体液图层。

---

## 体液部位

`NPCFluids` 支持以下身体部位：

| 部位 (Part)   | 含义       | 滴落动画 | 静态残留 |
| ------------- | ---------- | -------- | -------- |
| `vagina`      | 阴部       | 是       | 否       |
| `anus`        | 肛门       | 是       | 否       |
| `mouth`       | 嘴部       | 是       | 否       |
| `chest`       | 胸部       | 否       | 是       |
| `face`        | 面部       | 否       | 是       |
| `feet`        | 足部       | 否       | 是       |
| `leftarm`     | 左臂       | 否       | 是       |
| `rightarm`    | 右臂       | 否       | 是       |
| `neck`        | 脖子       | 否       | 是       |
| `thigh`       | 大腿       | 否       | 是       |
| `tummy`       | 腹部       | 否       | 是       |

每个部位的体液值范围为 **0 ~ 5**：

- `0` = 无体液
- `1` = 轻微
- `2` = 较少
- `3` = 中等
- `4` = 较多
- `5` = 非常多

---

## NPCFluids API

`NPCFluids` 是一个单例对象，用于管理所有 NPC 的体液数据。

### 获取体液数据

```typescript
import NPCFluids from '../modules/NamedNPCAddon/NPCFluids';

// 获取 NPC 的体液数据，若不存在则初始化
const fluids = NPCFluids.get('Elara');
console.log(fluids.face);   // 0
console.log(fluids.chest);  // 0
```

### 设置体液值

```typescript
// 设置单个部位的体液值
NPCFluids.set('Elara', 'face', 3);
```

### 增加 / 减少体液值

```typescript
// 增加体液值（默认 +1）
NPCFluids.add('Elara', 'chest', 2);

// 减少体液值（默认 -1）
NPCFluids.reduce('Elara', 'chest', 1);
```

### 清除体液

```typescript
// 清除单个部位
NPCFluids.clear('Elara', 'face');

// 清除所有部位
NPCFluids.clear('Elara');
```

### 全局衰减

```typescript
// 所有 NPC 的所有部位体液值 -1
NPCFluids.decay(1);
```

---

## 侧边栏体液图层

体液图层是预注册的 [NPC 侧边栏](./npc-sidebar) 图层，无需在 `boot.json` 中额外配置。只要 NPC 使用了动态模型模式，体液图层会自动生效。

### 图层列表

#### 滴落动画图层

| 图层 ID              | 动画名称              | 遮罩     |
| -------------------- | --------------------- | -------- |
| `nnpc_drip_vaginal`  | `VaginalCumDrip`      | 是       |
| `nnpc_drip_anal`     | `AnalCumDrip`         | 是       |
| `nnpc_drip_mouth`    | `MouthCumDrip`        | 是       |

滴落动画根据体液值（1–5）选择不同速度的动画：

| 值 | 速度         |
| -- | ------------ |
| 1  | `Start`      |
| 2  | `VerySlow`   |
| 3  | `Slow`       |
| 4  | `Fast`       |
| 5  | `VeryFast`   |

#### 静态残留图层

| 图层 ID              | 图片路径                     | 可见条件                     |
| -------------------- | ---------------------------- | ---------------------------- |
| `nnpc_cum_chest`     | `img/body/cum/chest-{n}.png` | 体液值 > 0                   |
| `nnpc_cum_face`      | `img/body/cum/face-{n}.png`  | 体液值 > 0 且面部未被遮挡    |
| `nnpc_cum_feet`      | `img/body/cum/feet-{n}.png`  | 体液值 > 0                   |
| `nnpc_cum_leftarm`   | `img/body/cum/left-arm-{n}.png` | 左臂可见                 |
| `nnpc_cum_rightarm`  | `img/body/cum/right-arm-{n}.png` | 右臂可见且非 hold 姿势  |
| `nnpc_cum_neck`      | `img/body/cum/neck-{n}.png`  | 体液值 > 0                   |
| `nnpc_cum_thigh`     | `img/body/cum/thighs-{n}.png` | 体液值 > 0                  |
| `nnpc_cum_tummy`     | `img/body/cum/tummy-{n}.png` | 体液值 > 0                   |

其中 `{n}` 为体液等级对应的数字（1–5）。

---

## 图层配置结构

体液图层的渲染回调由 `fluids_layers.ts` 中的工厂函数生成，遵循与 [NPC 侧边栏](./npc-sidebar) 相同的图层配置结构：

```typescript
interface FluidLayerConfig {
  srcfn(options): string;       // 返回图片路径，空字符串表示不显示
  showfn(options): boolean;     // 是否显示该图层
  zfn(options): number;         // Z 轴层级
  masksrcfn(options): string;   // 遮罩图片路径（用于 close-up 视图）
  dxfn(options): number;        // X 轴偏移
  dyfn(options): number;        // Y 轴偏移
  animation?: string;           // 静态图层的动画名称（固定为 'idle'）
  animationfn?(options): string; // 动态滴落动画名称（仅滴落图层）
}
```

### 可见性规则

- **面部** (`face`)：必须面部未被 `mask` 或 `face_covering` 类型衣物遮挡
- **嘴部** (`mouth`)：必须面部未被遮挡
- **左臂** (`leftarm`)：手臂不能为 `none` 或 `cover` 姿态
- **右臂** (`rightarm`)：手臂不能为 `none`、`cover` 或 `hold` 姿态

---

## 图片资源路径

体液图片位于 BeautySelectorAddon 的图片目录下：

```
img/body/cum/
├── chest-1.png ... chest-4.png
├── face-1.png ... face-3.png
├── feet-1.png ... feet-2.png
├── left-arm-1.png ... left-arm-2.png
├── right-arm-1.png ... right-arm-2.png
├── neck-1.png ... neck-3.png
├── thighs-1.png ... thighs-5.png
├── tummy-1.png ... tummy-5.png
├── vaginal-*.png   (滴落动画帧)
├── anal-*.png      (滴落动画帧)
└── mouth-*.png     (滴落动画帧)
```

---

## 相关文档

- [NPC 侧边栏](./npc-sidebar) — 侧边栏显示系统
- [NPC 注册](./) — NPC 注册与基础配置
