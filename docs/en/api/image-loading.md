# Image Loading and HtmlTagSrcHook

ModLoader intercepts image requests via `HtmlTagSrcHook` so images can be loaded from Mod zips without a server.

## How It Works

Since v1.6.0, ModLoader hooks into SC2's `Wikifier.Parser.add 'htmlTag'` to intercept image creation:

```js
if (typeof window.modSC2DataManager !== 'undefined' &&
    typeof window.modSC2DataManager.getHtmlTagSrcHook?.()?.doHook !== 'undefined') {
  if (tagName === 'img' && !el.getAttribute('src')?.startsWith('data:')) {
    el.setAttribute('ML-src', el.getAttribute('src'));
    el.removeAttribute('src');
    window.modSC2DataManager.getHtmlTagSrcHook().doHook(el).catch(E => console.error(E));
  }
}

// SC2 original (insert above this line)
output.appendChild(tagName === 'track' ? el.cloneNode(true) : el);
```

All HTML `<img>` tags created by SC2 can now be intercepted and replaced. Previously, only canvas-drawn images were handled.

## Sync Path: Intercept HTMLImageElement

If you have an `HTMLImageElement`, you can let ModLoader handle its `src`:

```js
const el = document.createElement('img');
el.src = 'aaaa/bbbb/cccc/dddd.jpg';

if (typeof window.modSC2DataManager !== 'undefined' &&
    typeof window.modSC2DataManager.getHtmlTagSrcHook?.()?.doHook !== 'undefined') {
  if (el.tagName === 'img' && !el.hasAttribute('ML-src') &&
      !el.getAttribute('src')?.startsWith('data:')) {
    el.setAttribute('ML-src', el.getAttribute('src'));
    el.removeAttribute('src');
    window.modSC2DataManager.getHtmlTagSrcHook().doHook(el).catch(E => console.error(E));
  }
}

// el can be used; image shows when load completes
document.body.appendChild(el);
```

## Async Path: Direct Image Request

Pass an image path and receive a Promise:

```js
// async-await
const imageData = await window.modSC2DataManager
  .getHtmlTagSrcHook()
  .requestImageBySrc('path/to/image');

// Promise
window.modSC2DataManager
  .getHtmlTagSrcHook()
  .requestImageBySrc('path/to/image')
  .then(imageData => {
    // Process image data
  });
```

## Using ImageLoaderHook Addon

For most Mod authors, use the [ImageLoaderHook](https://github.com/Lyoko-Jeremie/DoL_ImgLoaderHooker) Addon (v2.3.0+), which wraps HtmlTagSrcHook. Add images to `boot.json`'s `imgFileList`; images matching the base game are replaced automatically.

:::info
Some DoL images are not intercepted—they are created by DoL's custom `Macro.add("icon", ...)` and mostly used before links.
:::
