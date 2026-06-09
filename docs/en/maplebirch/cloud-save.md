# Cloud Save Service

The cloud save service allows players to upload local saves to the cloud and sync across devices. The framework provides two backend options and a client API suite, accessible through the in-game panel for uploading, downloading, and save code import/export operations.

## How It Works

`CloudSaveService` handles all client-side logic and supports two backends:

| Backend | Protocol | Use Case |
| --- | --- | --- |
| Go + SQLite Server | REST API | Local / LAN / Self-hosted |
| Cloudflare Worker + R2 + D1 | WebDAV | Production deployment, zero-ops |

All save data is encrypted with **AES-256-GCM** before upload (PBKDF2 key derivation with 150,000 iterations). The password is the player's game password. Data is also automatically gzip-compressed (only when compression reduces size).

## Game Panel

The framework includes a built-in cloud save panel (`#maplebirch-cloud-save`) with the following features:

- **Address / Account / Password** — Enter backend URL and cloud save credentials (not Cloudflare credentials)
- **Register / Connect / Delete Account** — Manage server accounts
- **Local Slot** — Select save slot 0-10
- **Upload / Download / Delete** — Sync saves with the cloud
- **Save Code** — Export current save code, upload code, download code, import code

## Client API

`CloudSaveService` is accessible via `maplebirch.cloudSave`. Public methods below:

### Configuration and Authentication

```javascript
// Configure backend connection
maplebirch.cloudSave.configure({
  mode: 'server',        // 'server' | 'webdav'
  endpoint: 'http://localhost:8787',
  username: 'myuser',
  password: 'mypassword'
});

// Register a new account (server mode only)
await maplebirch.cloudSave.register('myuser', 'mypassword');

// Login (server mode only)
await maplebirch.cloudSave.login('myuser', 'mypassword');

// Delete account (server mode only)
await maplebirch.cloudSave.deleteAccount('mypassword');
```

### Save Upload and Download

```javascript
// Upload local slot 1 to the cloud
await maplebirch.cloudSave.upload(1);

// Download cloud slot 1 to local slot 3
await maplebirch.cloudSave.download(1, 3);

// List all remote saves
const list = await maplebirch.cloudSave.listRemote();
// Returns [{ slot: number, updatedAt: number }, ...]

// Delete a remote slot
await maplebirch.cloudSave.deleteRemote(1);
```

### Save Code

```javascript
// Export current SugarCube save code
const code = maplebirch.cloudSave.exportCode();

// Convert local slot 1 to a save code
const slotCode = await maplebirch.cloudSave.exportSlotCode(1);

// Upload save code to the cloud
await maplebirch.cloudSave.uploadCode();

// Download save code from the cloud
const downloadedCode = await maplebirch.cloudSave.downloadCode();

// Import from save code into the game
maplebirch.cloudSave.importCode(code);
```

### Local Slot Import/Export

```javascript
// Export local indexedDB slot as CloudSaveRecord
const record = await maplebirch.cloudSave.exportSlot(1);

// Write CloudSaveRecord back to a local slot
await maplebirch.cloudSave.importSlot(record, 2);
```

## Server Deployment

### Go + SQLite

Suitable for local use, home LAN, or self-hosted servers. Listens on port `8787` by default.

#### Start

```powershell
bun run cloud:go
```

#### Configuration

Copy the example config and edit as needed:

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

| Field | Default | Description |
| --- | --- | --- |
| `addr` | `:8787` | HTTP listen address. `:<port>` listens on all interfaces; `<IP>:<port>` binds to a specific address |
| `dbPath` | `./cloud-save.db` | SQLite database file path |
| `sessionDays` | `30` | Login token validity in days |

Startup log displays the effective configuration:

```text
cloud save server listening on :8787, sqlite=./cloud-save.db, session_days=30
```

#### Health Check

```text
<backend URL>/health
```

Returns:

```json
{ "ok": true }
```

#### Game Panel Setup

```text
Address: Go backend URL
Account: Choose a name (3-40 chars, a-z, 0-9, _, -)
Password: At least 8 characters
```

Click "Register" on the first use; after registration you are logged in automatically. Use "Connect" on subsequent visits.

#### PowerShell Quick Test

```powershell
# Health check
Invoke-RestMethod -Uri "<backend URL>/health"

# Register
$endpoint = "<backend URL>"
$body = @{ username = "test_user"; password = "password123" } | ConvertTo-Json
$auth = Invoke-RestMethod -Method Post -Uri "$endpoint/auth/register" -ContentType "application/json" -Body $body

# Read remote slots
Invoke-RestMethod -Uri "$endpoint/saves" -Headers @{ Authorization = "Bearer $($auth.token)" }

# Delete test account
Invoke-RestMethod `
  -Method Delete `
  -Uri "$endpoint/auth/account" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $($auth.token)" } `
  -Body (@{ password = "password123" } | ConvertTo-Json)
```

You can also specify an alternate config file:

```powershell
cd cloud-services\go-sql-server
go run . -config my-config.json
```

### Cloudflare Worker + R2 + D1

Suitable for production deployment using Cloudflare's global edge network with zero maintenance. Supports up to 5 cloud save accounts by default (configurable via `MAX_USERS` in `wrangler.toml`).

#### Create Resources

```powershell
bun run cloud:r2 r2 bucket create dol-cloud-save
bun run cloud:r2 d1 create dol-cloud-save-db
```

Fill the `database_id` from the D1 command output into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "SAVE_DB"
database_name = "dol-cloud-save-db"
database_id = "paste database_id here"
```

#### Initialize Database and Deploy

```powershell
bun run cloud:r2 d1 migrations apply dol-cloud-save-db --remote
bun run cloud:r2 deploy
```

After successful deployment, the Worker URL is written to `cloud-services/cloudflare-webdav-worker/worker-url.txt`.

#### wrangler.toml Example

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

#### Local Development

```powershell
bun run cloud:r2 dev
```

Local D1 data is stored in the `.wrangler/` directory and is not committed to version control.

#### Game Panel Setup

```text
Address: Worker URL
Account: Custom cloud save account (not Cloudflare credentials)
Password: At least 8 characters
```

Click "Register" on the first use, then "Connect" afterwards.

## Admin UI

The admin panel is used for monitoring and managing the cloud save service:

```powershell
bun run cloud:admin
```

## Related Pages

- [Mod Protection and Credentials](./mod-protection) — Authentication credential management and mod encryption
