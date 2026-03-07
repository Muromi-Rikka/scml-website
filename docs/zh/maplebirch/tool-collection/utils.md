# 工具函数 (Utilities)

## 基本介绍

框架提供了一套完整的工具函数集，已全局挂载在 `window` 对象上，可在模组开发的任意位置直接使用。  
这些函数涵盖了数据处理、随机生成、条件处理、字符串处理、数值修整、图片加载等常见场景，可用于减少重复代码并提高模组开发效率。

所有工具函数均可直接调用，例如：

```javascript
const result = clone({ a: 1 });
const value = number("12.5");
const text = convert("Hello World", "snake");
```

---

## 工具函数列表

| 函数         | 类别       | 主要功能                                     |
| :----------- | :--------- | :------------------------------------------- |
| `clone`      | 数据处理   | 深度克隆对象，支持多种数据类型               |
| `equal`      | 数据处理   | 深度比较两个值是否相等                       |
| `merge`      | 数据处理   | 递归合并多个对象，支持多种合并模式           |
| `contains`   | 数组处理   | 检查数组是否包含指定元素                     |
| `random`     | 随机生成   | 生成随机数，支持整数、浮点数                 |
| `either`     | 随机生成   | 从选项中随机选择一个，支持权重               |
| `SelectCase` | 条件处理   | 提供链式 API 的条件选择器                    |
| `convert`    | 字符串处理 | 将字符串转换为指定格式                       |
| `number`     | 数值处理   | 将输入修整为合法数值，支持范围、取整、步进等 |
| `loadImage`  | 资源处理   | 检查并加载图片资源                           |

---

## 数据处理工具

### 深度克隆 (clone)

用于深度克隆常见对象，支持：

- 普通对象、数组
- `Date`、`RegExp`
- `Map`、`Set`
- `ArrayBuffer`、`DataView`、TypedArray

**参数**：`source`（源对象）、`opt.deep`（是否深克隆，默认 `true`）、`opt.proto`（是否保留原型链，默认 `true`）

**返回值**：克隆后的新对象

```javascript
const original = { a: 1, b: { c: 2 } };
const cloned = clone(original);
// 浅克隆数组
const shallowArr = clone(arr, { deep: false });
```

---

### 深度比较 (equal)

用于深度比较两个值是否相等，内部基于 lodash 的深比较逻辑。

**参数**：`a`、`b`

**返回值**：`true` 或 `false`

```javascript
equal({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
equal([1, 2], [1, 2]); // true
```

---

### 递归合并 (merge)

`merge` 会原地修改目标对象，并递归合并后续对象。

**支持模式**：`replace`（替换数组，默认）、`concat`（拼接数组）、`merge`（按索引递归合并）

**参数**：`target`、`...sources`、`mode`、`filterFn`

**返回值**：合并后的 `target`

```javascript
const target = { a: 1 };
merge(target, { b: 2 }, { c: 3 }); // { a: 1, b: 2, c: 3 }
merge(target, source, "concat"); // 数组合并时拼接
```

---

### 数组包含检查 (contains)

支持单值、多值、深度比较、忽略大小写、自定义比较函数。

**模式**：`all`（全部存在）、`any`（任意存在）、`none`（全部不存在）

**参数**：`arr`、`value`（可为单个值或数组）、`mode`、`opt.case`、`opt.compare`、`opt.deep`

**返回值**：布尔值

```javascript
contains([1, 2, 3], 2); // true
contains([1, 2, 3], [1, 2], "all"); // true
contains([1, 2, 3], [1, 4], "any"); // true
contains([1, 2, 3], [4, 5], "none"); // true
contains([1, 2, 3], 4, "none"); // true
```

---

## 随机生成工具

### 随机数生成 (random)

用于生成随机整数或随机浮点数。

**参数**：`min`、`max`、`float`（是否生成浮点数）；或配置对象 `{ min, max, float }`

**返回值**：生成的随机数

```javascript
random(); // 0-1 之间的随机浮点数
random(10); // 0-10 的随机整数
random(5, 10); // 5-10 的随机整数
random({ min: 5, max: 10, float: true }); // 配置对象方式
```

---

### 随机选择 (either)

支持数组形式、参数形式，以及权重和 `null` 选项。

**参数**：`itemsOrA`（候选项数组或第一个候选值）、`...rest`、`weights`、`null`（是否允许返回 null）

**返回值**：随机选中的值

```javascript
either(["A", "B", "C"]); // 随机返回其中一个
either("A", "B", "C"); // 参数方式
either(["A", "B"], { weights: [0.8, 0.2] }); // 80% 概率返回 'A'
either(["A", "B"], { null: true }); // 约 1/(length+1) 概率返回 null
```

---

## 条件处理工具

### 条件选择器 (SelectCase)

适合多条件分支、范围匹配、正则匹配和自定义判断。

**方法**：`.case()`、`.casePredicate()`、`.caseRange()`、`.caseIn()`、`.caseIncludes()`、`.caseRegex()`、`.caseCompare()`、`.else()`、`.match()`

**返回值**：`match()` 返回首个命中条件对应的结果；未命中则返回 `else()` 设置的默认值

```javascript
const selector = new SelectCase()
  .case(1, "One")
  .case(2, "Two")
  .caseRange(3, 5, "Three to Five")
  .caseIn(["admin", "root"], "管理员")
  .caseIncludes(["error", "fail"], "错误状态")
  .caseRegex(/^\d+$/, "纯数字")
  .casePredicate((x) => x > 10, "大于10")
  .else("未知");

selector.match(3); // 'Three to Five'
selector.match("admin"); // '管理员'
selector.match("test"); // '未知'
```

---

## 字符串处理工具

### 字符串转换 (convert)

支持常见命名风格转换，`title` 模式下可保留首字母缩略词。

**模式**：`lower`、`upper`、`capitalize`、`title`、`camel`、`pascal`、`snake`、`kebab`、`constant`

**参数**：`str`、`mode`（默认 `'lower'`）、`opt.delimiter`、`opt.acronym`

**返回值**：转换后的字符串

```javascript
convert("Hello World", "snake"); // 'hello_world'
convert("Hello World", "kebab"); // 'hello-world'
convert("Hello World", "camel"); // 'helloWorld'
convert("HTTP API", "title", { acronym: true }); // 'HTTP API'
convert("HTTP API", "title", { acronym: false }); // 'Http Api'
```

---

## 数值处理工具

### 数值修整 (number)

`number` 用于把任意输入修整成可用数值，支持：

- 非法值回退
- 最小/最大范围限制
- 取整模式（floor、ceil、round、trunc）
- 步进吸附
- 百分比输出
- 循环区间

**参数**：`value`、`fallback`（默认 `0`）、`min`、`max`、`mode`、`opt.step`、`opt.percent`、`opt.loop`

**返回值**：修整后的数值；`opt.percent` 为 `true` 时返回 0~100 的百分比

```javascript
number("12.5"); // 12.5
number(undefined, 10); // 10
number(120, 0, 0, 100); // 100
number(5.8, 0, 0, 10, "floor"); // 5
number(17, 0, 0, 100, "round", { step: 5 }); // 15
number(370, 0, 0, 360, "none", { loop: true }); // 10
number(75, 0, 0, 200, "none", { percent: true }); // 37.5
```

---

## 资源处理工具

### 图片加载 (loadImage)

用于检查图片资源是否存在，并在可用时返回可加载结果。

**参数**：`src`（图片路径）

**返回值**：同步时返回 `string` 或 `boolean`；异步时返回 `Promise`

```javascript
// 同步检查
const exists = loadImage("character.png");
if (exists) {
  // 使用 exists
}

// 异步加载
loadImage("character.png").then((data) => {
  if (typeof data === "string") {
    document.getElementById("avatar").src = data;
  }
});
```
