# 图片加载与 HtmlTagSrcHook

ModLoader 通过 `HtmlTagSrcHook` 机制拦截游戏中的图片请求，实现从 Mod zip 中加载替换图片，无需服务器。

## 工作原理

从 v1.6.0 开始，ModLoader 通过修改 SC2 引擎的 `Wikifier.Parser.add 'htmlTag'`，在创建 `<img>` 标签前拦截图片请求：

```js
if (typeof window.modSC2DataManager !== 'undefined' &&
    typeof window.modSC2DataManager.getHtmlTagSrcHook?.()?.doHook !== 'undefined') {
  if (tagName === 'img' && !el.getAttribute('src')?.startsWith('data:')) {
    el.setAttribute('ML-src', el.getAttribute('src'));
    el.removeAttribute('src');
    window.modSC2DataManager.getHtmlTagSrcHook().doHook(el).catch(E => console.error(E));
  }
}

// SC2 原始代码（上面的代码需要插入在这一行之前）
output.appendChild(tagName === 'track' ? el.cloneNode(true) : el);
```

此修改使得 SC2 引擎创建的所有 HTML `<img>` 标签引用的图片都能被 ModLoader 拦截和替换。在此之前，只有 canvas 绘图引用的图片才会被替换。

## 同步方式：拦截 HTMLImageElement

如果你有一个 `HTMLImageElement`，可以用以下代码让 ModLoader 加载其 `src` 指向的图片：

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

// 继续使用 el，图片会在加载完成后自动显示
document.body.appendChild(el);
```

## 异步方式：直接请求图片数据

直接传入图片路径，返回 Promise，异步等待图片数据：

```js
// async-await 语法
const imageData = await window.modSC2DataManager
  .getHtmlTagSrcHook()
  .requestImageBySrc('图片路径');

// Promise 语法
window.modSC2DataManager
  .getHtmlTagSrcHook()
  .requestImageBySrc('图片路径')
  .then(imageData => {
    // 处理图片数据
  });
```

## 使用 ImageLoaderHook Addon

对于大多数 Mod 作者，推荐使用 [ImageLoaderHook](https://github.com/Lyoko-Jeremie/DoL_ImgLoaderHooker) Addon（v2.3.0+），它已经封装了 `HtmlTagSrcHook` 的支持。只需在 `boot.json` 的 `imgFileList` 中列出图片文件，与原游戏同名的图片会自动替换。

:::info
DoL 游戏中仍存在部分未被拦截的图片，这些图片由 DoL 自定义的 `Macro.add("icon", ...)` 标签实现，几乎全部用在 link 前。
:::
