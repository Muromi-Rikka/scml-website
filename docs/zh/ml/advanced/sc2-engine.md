# 定制 SC2 引擎

ModLoader 需要使用经过修改的 SugarCube2 引擎才能正常引导。本文说明引擎修改的内容以及如何不重新编译游戏直接替换引擎。

## 修改版引擎仓库

修改版 SC2 引擎：[sugarcube-2_Vrelnir](https://github.com/Lyoko-Jeremie/sugarcube-2_Vrelnir)

使用此 ModLoader 的游戏必须使用此版本的 SC2 引擎。

## 引擎修改内容

### 1. 修改启动点

在 `sugarcube.js` 的 jQuery 闭包中添加 ModLoader 的异步等待逻辑，将原始启动代码包装为 `mainStart()` 函数：

```js
jQuery(() => {
  "use strict";

  const mainStart = () => {
    // 原来的 jQuery(() => {}) 的内容
  };

  if (typeof window.modSC2DataManager !== "undefined") {
    window.modSC2DataManager
      .startInit()
      .then(() => window.jsPreloader.startLoad())
      .then(() => mainStart())
      .catch((err) => {
        console.error(err);
      });
  } else {
    mainStart();
  }
});
```

这使得启动顺序从 `jQuery -> SC2` 变为 `jQuery -> ModLoader -> SC2`。

### 2. Wikifier 增强

添加 `_lastPassageQ` 及对应的数据和操作来跟踪整个脚本的编译过程，目的是跟踪和修改各个编译层级。

涉及的文件：

- `macrolib.js`
- `parserlib.js`
- `wikifier.js`

可使用 `passageObj` 关键字进行查找。

### 3. img/svg 标签拦截

拦截 `img` 标签和 `svg` 标签的创建，实现完全从内存加载所有图片（无需服务器）。

在 `Wikifier.Parser.add 'htmlTag'` 中添加：

```js
if (
  typeof window.modSC2DataManager !== "undefined" &&
  typeof window.modSC2DataManager.getHtmlTagSrcHook?.()?.doHook !== "undefined"
) {
  if (tagName === "img" && !el.getAttribute("src")?.startsWith("data:")) {
    el.setAttribute("ML-src", el.getAttribute("src"));
    el.removeAttribute("src");
    window.modSC2DataManager
      .getHtmlTagSrcHook()
      .doHook(el)
      .catch((E) => console.error(E));
  }
}
```

## 不重新编译直接替换引擎

使用 `sc2ReplaceTool` 可以将新的 SC2 引擎直接替换到已编译的游戏 HTML 中，无需重新编译整个游戏。

### 步骤

**1.** 执行替换：

```bash
node "<sc2ReplaceTool.js 路径>" "<编译后的游戏 HTML>" "<新的 format.js 路径>"
```

示例：

```bash
node "dist-insertTools/sc2ReplaceTool.js" "Degrees of Lewdity VERSION.html" "build/twine2/sugarcube-2/format.js"
```

生成带 `.sc2replace.html` 后缀的文件：

```
Degrees of Lewdity VERSION.html.sc2replace.html
```

**2.** 然后用 `insert2html` 将 ModLoader 注入到替换后的 HTML：

```bash
node "dist-insertTools/insert2html.js" "Degrees of Lewdity VERSION.html.sc2replace.html" "modList.json" "dist-BeforeSC2/BeforeSC2.js"
```

最终生成：

```
Degrees of Lewdity VERSION.html.sc2replace.html.mod.html
```

## 编译 SC2 引擎

在修改版 SC2 引擎项目中执行：

```bash
node build.js -d -u -b 2
```

编译结果位于 `build/twine2/sugarcube-2/format.js`。
