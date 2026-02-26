# 角色渲染系统

Character 模块负责 PC（玩家角色）的渲染增强，包括图层扩展、面部样式、发色渐变和遮罩生成。

## 图层系统

框架通过拦截游戏的 `Renderer.CanvasModels.main` 模型，将自定义图层与原始图层深度合并。

### 内置图层

框架预置了以下图层覆盖：

| 图层 | 功能 |
|------|------|
| `hair_sides` | 侧发遮罩支持 |
| `hair_sides_close_up` | 侧发特写（含遮罩、srcfn、showfn、zfn、filtersfn） |
| `hair_fringe` | 刘海遮罩支持 |
| `hair_fringe_close_up` | 刘海特写 |
| `freckles` | 雀斑（面部样式） |
| `ears` | 耳朵（面部样式） |
| `eyes` / `sclera` | 眼睛 / 巩膜 |
| `left_iris` / `right_iris` | 左右虹膜 |
| `eyelids` / `lashes` | 眼睑 / 睫毛 |
| `brows` / `mouth` / `blush` / `tears` | 眉毛 / 嘴巴 / 腮红 / 眼泪 |
| `makeup_*` | 化妆图层（眼影、睫毛膏、腮红、口红等） |

### 自定义图层

Mod 开发者可以通过 `use()` 方法添加或覆盖图层：

```js
maplebirch.char.use({
  my_layer: {
    srcfn(options) {
      return `img/custom/${options.my_variant}.png`;
    },
    showfn(options) {
      return options.show_custom;
    },
    zfn() {
      return 10;
    }
  }
});
```

图层配置支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `srcfn` | `(options) => string` | 返回图片路径 |
| `showfn` | `(options) => boolean` | 控制图层是否显示 |
| `zfn` | `(options) => number` | 返回 Z-Index |
| `masksrcfn` | `(options) => any` | 返回遮罩图片路径 |
| `filtersfn` | `(options) => string[]` | 返回滤镜名称列表 |
| `animation` | `string` | 动画类型 |

## 预处理与后处理

Character 支持注册预处理和后处理函数，在渲染流程中执行：

```js
// 注册预处理函数
maplebirch.char.use('pre', (options) => {
  // 在渲染前修改 options
  options.custom_field = 'value';
});

// 注册后处理函数
maplebirch.char.use('post', (options) => {
  // 在渲染后处理
});
```

框架内置的预处理函数会：
- 将遮罩值注入到 `options.maplebirch.char.mask`
- 处理发色渐变滤镜

## 面部样式

框架扩展了游戏的面部样式系统，支持 Mod 添加自定义面部样式和变体。

### 面部样式图片路径解析

面部样式图片按以下优先顺序查找：

1. `img/face/{facestyle}/{facevariant}/{image}.png`
2. `img/face/{facestyle}/{image}.png`
3. `img/face/default/{facevariant}/{image}.png`
4. `img/face/default/{image}.png`
5. `img/face/default/default/{image}.png`

### 自动发现

框架会扫描所有已加载 Mod 的 zip 文件，自动发现 `img/face/` 目录下的面部样式和变体，并更新 `setup.faceStyleOptions` 和 `setup.faceVariantOptions`。

## 遮罩生成器

`mask()` 函数用于生成 canvas 遮罩图像：

```js
const maskUrl = maplebirch.char.mask(x, swap, width, height);
```

| 参数 | 默认值 | 说明 |
|------|-------|------|
| `x` | 0 | 遮罩分割位置偏移 |
| `swap` | false | 是否交换左右遮罩 |
| `width` | 256 | 画布宽度 |
| `height` | 256 | 画布高度 |

遮罩值通过 `V.options.maplebirch.character.mask` 配置。

## 发色渐变

框架支持发色渐变（Hair Colour Gradients），为侧发和刘海提供多色渐变效果。

渐变通过 `hair_colour_style: 'gradient'` 和 `hair_colour_gradient` 选项启用，支持：

- 多个颜色节点的位置自定义（存储在 `V.options.maplebirch.character` 中）
- 亮度调整
- 混合模式（hard-light）
- 按发型和发长自适应

## Transformation

`Transformation` 子模块处理角色变换效果（如狼化等），通过修改游戏脚本注入自定义逻辑。

```js
// 变换模块通过 char.transformation 访问
maplebirch.char.transformation.inject();
```

## Z-Index 参考

通过 `maplebirch.char.ZIndices` 访问角色渲染的 Z-Index 常量：

```js
const z = maplebirch.char.ZIndices;
// z.backhair, z.hairforwards, z.front_hair, ...
```
