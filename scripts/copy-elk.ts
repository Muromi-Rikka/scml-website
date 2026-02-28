import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "node_modules/elkjs/lib/elk.bundled.js");
const toDir = join(root, "docs/public");
const to = join(toDir, "elk.bundled.js");

const source = Bun.file(from);
if (!(await source.exists())) {
  console.warn("copy-elk: elkjs not found, skip copying elk.bundled.js");
  process.exit(0);
}

let version = "unknown";
try {
  const pkg = (await Bun.file(join(root, "node_modules/elkjs/package.json")).json()) as {
    version?: string;
  };
  version = pkg.version ?? version;
} catch {
  // ignore
}

await Bun.write(to, source);
console.log(`copy-elk: copied elk.bundled.js (elkjs@${version}) to docs/public/`);
