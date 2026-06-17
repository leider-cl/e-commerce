import { chmodSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const distPath = new URL("../dist", import.meta.url).pathname;

function chmodRecursive(path) {
  if (!existsSync(path)) return;

  const stats = statSync(path);
  chmodSync(path, stats.isDirectory() ? 0o755 : 0o644);

  if (!stats.isDirectory()) return;

  for (const entry of readdirSync(path)) {
    chmodRecursive(join(path, entry));
  }
}

chmodRecursive(distPath);
