# 云存档服务

云存档服务允许玩家将本地存档上传至云端，并在不同设备之间同步。框架提供两种后端方案和一套客户端 API，通过游戏面板即可完成上传、下载、存档码导入导出等操作。

## 工作原理

`CloudSaveService` 负责客户端的全部逻辑，支持两种后端：

| 后端 | 协议 | 适用场景 |
| --- | --- | --- |
| Go + SQLite 服务 | REST API | 本机 / 局域网 / 自有服务器 |
| Cloudflare Worker + R2 + D1 | WebDAV | 生产环境部署，免运维 |

所有存档数据在上传前经过 **AES-256-GCM** 加密（PBKDF2 派生密钥，150 000 次迭代），密码即玩家的游戏密码。数据还会自动进行 gzip 压缩（仅在压缩后体积更小时生效）。

## 游戏面板

框架内置云存档面板（`#maplebirch-cloud-save`），提供以下操作：

- **地址 / 账号 / 密码** — 填写后端 URL 和云存档账户（非 Cloudflare 账户）
- **注册 / 连接 / 删除账户** — 管理服务端账户
- **本地槽位** — 选择 0-10 号存档槽位
- **上传 / 下载 / 删除** — 与云端同步存档
- **存档码** — 导出当前存档码、上传存档码、下载存档码、导入存档码

## 客户端 API

`CloudSaveService` 通过 `maplebirch.cloudSave` 访问。以下为公开方法：

### 配置与认证

```javascript
// 配置后端连接
maplebirch.cloudSave.configure({
  mode: 'server',        // 'server' | 'webdav'
  endpoint: 'http://localhost:8787',
  username: 'myuser',
  password: 'mypassword'
});

// 注册新账户（仅 server 模式）
await maplebirch.cloudSave.register('myuser', 'mypassword');

// 登录（仅 server 模式）
await maplebirch.cloudSave.login('myuser', 'mypassword');

// 删除账户（仅 server 模式）
await maplebirch.cloudSave.deleteAccount('mypassword');
```

### 存档上传与下载

```javascript
// 上传本地槽位 1 到云端
await maplebirch.cloudSave.upload(1);

// 从云端下载槽位 1 到本地槽位 3
await maplebirch.cloudSave.download(1, 3);

// 列出云端所有存档
const list = await maplebirch.cloudSave.listRemote();
// 返回 [{ slot: number, updatedAt: number }, ...]

// 删除云端槽位
await maplebirch.cloudSave.deleteRemote(1);
```

### 存档码

```javascript
// 导出当前 SugarCube 存档码
const code = maplebirch.cloudSave.exportCode();

// 把本地槽位 1 转成存档码
const slotCode = await maplebirch.cloudSave.exportSlotCode(1);

// 上传存档码到云端
await maplebirch.cloudSave.uploadCode();

// 从云端下载存档码
const downloadedCode = await maplebirch.cloudSave.downloadCode();

// 从存档码导入到游戏
maplebirch.cloudSave.importCode(code);
```

### 本地槽位导入导出

```javascript
// 导出本地 indexedDB 槽位为 CloudSaveRecord
const record = await maplebirch.cloudSave.exportSlot(1);

// 把 CloudSaveRecord 写回本地槽位
await maplebirch.cloudSave.importSlot(record, 2);
```

## 服务端部署

### Go + SQLite

适用于本机、家庭局域网或自有服务器。默认监听 `8787` 端口。

#### 启动

```powershell
bun run cloud:go
```

#### 配置

复制示例配置并按需修改：

```powershell
Copy-Item cloud-services\go-sql-server\config.example.json cloud-services\go-sql-server\config.json
```

```json
{
  "addr": ":8787",
  "dbPath": "./cloud-save.db",
  "sessionDays": 30
}
```

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `addr` | `:8787` | HTTP 监听地址。`:<端口>` 监听所有网卡；`<IP>:<端口>` 只监听指定地址 |
| `dbPath` | `./cloud-save.db` | SQLite 数据库文件路径 |
| `sessionDays` | `30` | 登录 token 有效天数 |

启动日志会显示最终生效的配置：

```text
cloud save server listening on :8787, sqlite=./cloud-save.db, session_days=30
```

#### 健康检查

```text
<后端 URL>/health
```

返回：

```json
{ "ok": true }
```

#### 游戏面板填写

```text
地址：Go 后端 URL
账号：自己起一个名字（3-40 位，a-z、0-9、_、-）
密码：至少 8 位
```

第一次点「注册」，注册成功后自动登录；之后点「连接」即可。

#### PowerShell 快速测试

```powershell
# 健康检查
Invoke-RestMethod -Uri "<后端 URL>/health"

# 注册
$endpoint = "<后端 URL>"
$body = @{ username = "test_user"; password = "password123" } | ConvertTo-Json
$auth = Invoke-RestMethod -Method Post -Uri "$endpoint/auth/register" -ContentType "application/json" -Body $body

# 读取远端槽位
Invoke-RestMethod -Uri "$endpoint/saves" -Headers @{ Authorization = "Bearer $($auth.token)" }

# 删除测试账号
Invoke-RestMethod `
  -Method Delete `
  -Uri "$endpoint/auth/account" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $($auth.token)" } `
  -Body (@{ password = "password123" } | ConvertTo-Json)
```

也可以临时指定其它配置文件：

```powershell
cd cloud-services\go-sql-server
go run . -config my-config.json
```

### Cloudflare Worker + R2 + D1

适用于生产环境部署，利用 Cloudflare 全球边缘网络，免运维。默认最多 5 个游戏云存档账户（可在 `wrangler.toml` 的 `MAX_USERS` 修改）。

#### 创建资源

```powershell
bun run cloud:r2 r2 bucket create dol-cloud-save
bun run cloud:r2 d1 create dol-cloud-save-db
```

把 D1 命令输出里的 `database_id` 填进 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "SAVE_DB"
database_name = "dol-cloud-save-db"
database_id = "这里填 database_id"
```

#### 初始化数据库并部署

```powershell
bun run cloud:r2 d1 migrations apply dol-cloud-save-db --remote
bun run cloud:r2 deploy
```

部署成功后，Worker URL 会写入 `cloud-services/cloudflare-webdav-worker/worker-url.txt`。

#### wrangler.toml 示例

```toml
name = "dol-cloud-save-webdav"
main = "src/worker.ts"
compatibility_date = "2026-06-02"

[vars]
MAX_USERS = "5"

[[r2_buckets]]
binding = "SAVE_BUCKET"
bucket_name = "replace-with-your-r2-bucket-name"

[[d1_databases]]
binding = "SAVE_DB"
database_name = "dol-cloud-save-db"
database_id = "replace-with-your-d1-database-id"
```

#### 本地调试

```powershell
bun run cloud:r2 dev
```

本地 D1 数据放在 `.wrangler/` 目录，不会提交到版本控制。

#### 游戏面板填写

```text
地址：Worker URL
账号：自定义云存档账户（非 Cloudflare 账户）
密码：至少 8 位
```

第一次点「注册」，之后点「连接」。

## Admin UI

管理面板用于监控和管理云存档服务：

```powershell
bun run cloud:admin
```

## 相关页面

- [模组保护与凭证](./mod-protection) — 认证凭证管理与模组加密
