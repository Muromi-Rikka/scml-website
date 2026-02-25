# 示例 Mod 教程

本教程从零开始创建一个功能 Mod，涵盖 boot.json 编写、twee  passage、JS 脚本、CSS 样式、图片资源、打包和测试的完整流程。

## 目标

创建一个名为 `HelloMod` 的 Mod，实现以下功能：

- 在游戏中添加一个自定义 Passage，显示欢迎信息
- 通过 CSS 美化显示效果
- 通过 JS 添加一个简单的宏或功能
- 可选：替换一张游戏图片

## 步骤一：创建项目结构

创建以下目录结构（`HelloMod_Image` 为可选的图片资源目录）：

```tree
HelloMod
├── boot.json
├── readme.txt
├── HelloMod_style.css
├── HelloMod_script.js
├── HelloMod_passage.twee
└── HelloMod_Image
    └── character
        └── avatar.png
```

## 步骤二：编写 boot.json

在 `HelloMod/boot.json` 中写入：

```json
{
  "name": "HelloMod",
  "nickName": "示例 Mod",
  "version": "1.0.0",
  "styleFileList": ["HelloMod_style.css"],
  "scriptFileList": ["HelloMod_script.js"],
  "tweeFileList": ["HelloMod_passage.twee"],
  "imgFileList": [],
  "additionFile": ["readme.txt"]
}
```

若你添加了图片，在 `imgFileList` 中加入对应路径，例如：

```json
"imgFileList": ["HelloMod_Image/character/avatar.png"]
```

## 步骤三：编写 Twee Passage

在 `HelloMod_passage.twee` 中添加一个 Passage：

```text
:: HelloMod Welcome [passage]
你已成功加载 HelloMod！
这是自定义的 Passage 内容。
```

如需链接到该 Passage，在游戏其他 Passage 中写入：

```
[[进入 HelloMod 欢迎页->HelloMod Welcome]]
```

## 步骤四：编写 CSS 样式

在 `HelloMod_style.css` 中：

```css
/* HelloMod 样式 */
#passages .passage[data-passage="HelloMod Welcome"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1em;
  border-radius: 8px;
}
```

## 步骤五：编写 JS 脚本

在 `HelloMod_script.js` 中，可以添加 SugarCube 宏或全局函数。示例：注册一个简单宏，在控制台输出 Mod 名称：

```js
// 使用 SugarCube 的 Macro API
Macro.add("helloMod", {
  handler() {
    const text = this.args[0] || "HelloMod 已加载！";
    $(document.createElement("span")).wiki(text).appendTo(this.output);
  }
});
```

在 Twee 中使用：`<<helloMod "自定义文字">>`

## 步骤六：编写 readme.txt

在 `readme.txt` 中写入 Mod 说明，Mod 管理器会将其作为说明文件显示：

```
HelloMod - 示例 Mod
版本：1.0.0

这是一个用于演示 ModLoader 功能的示例 Mod。
```

## 步骤七：打包

### 手动打包

1. 选中 `boot.json` 及所有引用的文件（HelloMod_style.css、HelloMod_script.js、HelloMod_passage.twee、readme.txt 等）
2. 使用 7-Zip 等工具压缩为 Zip 格式
3. 确保 `boot.json` 在 zip 根目录，路径与 boot.json 中一致
4. 重命名为 `HelloMod.mod.zip`

### 自动打包（Node.js）

在 HelloMod 目录下执行：

```bash
node "<packModZip.js 路径>" "boot.json"
```

会生成 `HelloMod.mod.zip`。

## 步骤八：测试

1. 打开已集成 ModLoader 的游戏（如 DoL）
2. 在 Mod 管理器中上传或加载 `HelloMod.mod.zip`
3. 启用 HelloMod，刷新游戏
4. 在游戏中通过链接或宏验证功能是否生效

## 常见问题

### boot.json 不在 zip 根目录

确保压缩时选中的是文件本身，而不是整个 `HelloMod` 文件夹。错误示例：`HelloMod.mod.zip/HelloMod/boot.json`，正确应为 `HelloMod.mod.zip/boot.json`。

### 路径不匹配

`boot.json` 中的 `styleFileList`、`scriptFileList` 等路径必须与 zip 内实际路径完全一致，区分大小写。

### Mod 未生效

检查 Mod 管理器中的加载日志，确认是否因依赖检查失败被跳过。若依赖其他 Mod，需在 `boot.json` 的 `dependenceInfo` 中声明。
