# 随机数系统（randSystem）

提供各类随机数生成工具，包含加权随机、范围随机等功能。

_可通过 `maplebirch.tool.rand` 或快捷接口 `maplebirchFrameworks.rand()` 访问。_

## 使用方式

```js
const rand = maplebirch.tool.rand;
```

## 核心方法

| 方法 / 属性    | 说明                           |
| -------------- | ------------------------------ |
| `create()`     | 创建新的随机数生成器实例       |
| `Seed`         | 获取或设置种子（可重复性）     |
| `get(max)`     | 0 到 max（含）的随机整数       |
| `rng`          | 1–100 的随机整数（百分位判定） |
| `backtrack(n)` | 回退 n 步随机值                |
| `history`      | 已生成随机数历史               |
| `pointer`      | 当前历史指针位置               |

## 示例

```js
const rng = maplebirch.tool.rand.create();
rng.Seed = 42;

const num1 = rng.get(10); // 0–10
const num2 = rng.rng; // 1–100
```
