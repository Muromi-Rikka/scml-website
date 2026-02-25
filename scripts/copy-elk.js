import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const from = path.join(root, "node_modules", "elkjs", "lib", "elk.bundled.js");
const toDir = path.join(root, "docs", "public");
const to = path.join(toDir, "elk.bundled.js");

if (!fs.existsSync(from)) {
  console.warn("copy-elk: elkjs not found, skip copying elk.bundled.js");
  process.exit(0);
}
fs.mkdirSync(toDir, { recursive: true });
fs.copyFileSync(from, to);
console.log("copy-elk: copied elk.bundled.js to docs/public/");
