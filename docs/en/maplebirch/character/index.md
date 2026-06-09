# Character Rendering System

The Character module is responsible for PC (Player Character) rendering enhancement, including layer extension, facial styles, hair colour gradients, and mask generation.

## Layer System

The framework intercepts the game's `Renderer.CanvasModels.main` model and deep-merges custom layers with the original layers.

### Canvas Model Target

By default, `use()` targets the vanilla `main` model only. Pass `target` when a mod needs to patch another canvas model.

`target` accepts:

| Form | Purpose |
| :--- | :--- |
| `'main'` | One model |
| `['main', 'lighting']` | Multiple models |
| `(name, modelOrOptions) => boolean` | Dynamic matching |

### Built-in Layers

The framework provides the following layer overrides:

| Layer                                 | Function                                                          |
| ------------------------------------- | ----------------------------------------------------------------- |
| `hair_sides`                          | Side hair mask support                                            |
| `hair_sides_close_up`                 | Side hair close-up (includes mask, srcfn, showfn, zfn, filtersfn) |
| `hair_fringe`                         | Fringe mask support                                               |
| `hair_fringe_close_up`                | Fringe close-up                                                   |
| `freckles`                            | Freckles (facial style)                                           |
| `ears`                                | Ears (facial style)                                               |
| `eyes` / `sclera`                     | Eyes / Sclera                                                     |
| `left_iris` / `right_iris`            | Left/Right iris                                                   |
| `eyelids` / `lashes`                  | Eyelids / Lashes                                                  |
| `brows` / `mouth` / `blush` / `tears` | Brows / Mouth / Blush / Tears                                     |
| `makeup_*`                            | Makeup layers (eyeshadow, mascara, blush, lipstick, etc.)         |

### Custom Layers

Mod developers can add or override layers via the `use()` method:

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
    },
  },
});
```

Target a specific model:

```js
maplebirch.char.use(
  {
    my_mod_overlay: {
      srcfn: () => "img/myMod/overlay.png",
      showfn: () => true,
    },
  },
  "main"
);
```

Target multiple models:

```js
maplebirch.char.use(layers, ["main", "lighting"]);
```

Dynamic target:

```js
maplebirch.char.use(layers, (name) => name.startsWith("main"));
```

Layer configuration supports the following properties:

| Property    | Type                    | Description                         |
| ----------- | ----------------------- | ----------------------------------- |
| `srcfn`     | `(options) => string`   | Returns image path                  |
| `showfn`    | `(options) => boolean`  | Controls whether the layer is shown |
| `zfn`       | `(options) => number`   | Returns Z-Index                     |
| `masksrcfn` | `(options) => any`      | Returns mask image path             |
| `filtersfn` | `(options) => string[]` | Returns list of filter names        |
| `animation` | `string`                | Animation type                      |

## Preprocessing and Postprocessing

Character supports registering pre- and post-processing functions that run in the rendering pipeline:

```js
// Register preprocessing function
maplebirch.char.use("pre", (options) => {
  // Modify options before rendering
  options.custom_field = "value";
});

// Register postprocessing function
maplebirch.char.use("post", (options) => {
  // Process after rendering
});
```

Target specific canvas models for handlers:

```js
maplebirch.char.use(
  "pre",
  (options, model) => {
    options.myMod ??= {};
    options.myMod.modelName = model?.name;
  },
  ["main", "lighting"]
);
```

The second handler argument is the active `CanvasModel` instance. Ignore it when only the render options are needed.

The framework's built-in preprocessing functions will:

- Inject mask value into `options.maplebirch.char.mask`
- Process hair colour gradient filters

## Facial Styles

The framework extends the game's facial style system, allowing Mods to add custom facial styles and variants.

### Facial Style Image Path Resolution

Facial style images are resolved in the following priority order:

1. `img/face/{facestyle}/{facevariant}/{image}.png`
2. `img/face/{facestyle}/{image}.png`
3. `img/face/default/{facevariant}/{image}.png`
4. `img/face/default/{image}.png`
5. `img/face/default/default/{image}.png`

### Auto-discovery

The framework scans all loaded Mod zip files to auto-discover facial styles and variants under the `img/face/` directory, and updates `setup.faceStyleOptions` and `setup.faceVariantOptions`.

## Mask Generator

The `mask()` function is used to generate canvas mask images:

```js
const maskUrl = maplebirch.char.mask(x, rotation, swap, width, height);
```

| Parameter  | Default | Description                                     |
| ---------- | ------- | ----------------------------------------------- |
| `x`        | 0       | Mask split position offset (pixels from center) |
| `rotation` | 0       | Rotation angle, range -90° ~ 90°                |
| `swap`     | false   | Whether to swap left and right masks            |
| `width`    | 256     | Canvas width                                    |
| `height`   | 256     | Canvas height                                   |

Mask values are configured via `V.options.maplebirch.character.mask` and `V.options.maplebirch.character.rotation`. For NPC sidebar, use `V.options.maplebirch.npcsidebar.mask` and `V.options.maplebirch.npcsidebar.rotation`.

## Hair Colour Gradients

The framework supports Hair Colour Gradients, providing multi-colour gradient effects for side hair and fringe.

Gradients are enabled via `hair_colour_style: 'gradient'` and `hair_colour_gradient` options, supporting:

- Custom position for multiple colour nodes (stored in `V.options.maplebirch.character`)
- Brightness adjustment
- Blend mode (hard-light)
- Adaptive by hairstyle and hair length

## Transformation System

The Transformation system allows mod authors to add custom form changes (e.g. beast, divine, demon). See [Transformation](transformation) for full API and configuration.

```js
// Register via transformation.add
maplebirch.char.transformation.add("dragon", "physical", { ... });
```

## Pet Model

The framework supports deriving a standalone `pet` canvas model from the PC, used to display a miniature character alongside the sidebar. The `pet` model retains only body-related layers (base, face, hair, limbs, etc.) and excludes clothing and equipment.

The Pet model is managed via the `maplebirch.char.pet` namespace and supports the following configuration:

- `mask`: mask parameter
- `rotation`: rotation angle
- `animated`: whether to play animations
- `floating`: whether to float
- `scale`: scale factor (range 0.5 -- 1.0)

See the Pet API documentation for details.

## Z-Index Reference

Access Z-Index constants for character rendering via `maplebirch.char.ZIndices`:

```js
const z = maplebirch.char.ZIndices;
// z.backhair, z.hairforwards, z.front_hair, ...
```

## Notes

- Omit `target` to patch only `main`.
- Use an array for a known list of models; use a predicate only for rule-based matching.
- Prefix custom layer names with your mod name to avoid collisions.
