import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const videosPath = path.join(root, "data", "videos.json");
const videos = JSON.parse(await readFile(videosPath, "utf8"));

let hasFailure = false;

function checkUrl(url) {
  try {
    return execFileSync("curl", ["-I", "-L", "--max-time", "20", "-o", "/dev/null", "-s", "-w", "%{http_code}", url], {
      encoding: "utf8"
    }).trim();
  } catch (error) {
    return String(error.stdout || "").trim() || "000";
  }
}

for (const item of videos) {
  const linkStatus = item.linkStatus?.status;
  if (linkStatus !== "ok") {
    hasFailure = true;
    console.error(`FAIL\tstatus=${linkStatus ?? "missing"}\t${item.platform}\t${item.title}`);
    continue;
  }

  const httpCode = checkUrl(item.url);
  const reachable = /^2\d\d$/.test(httpCode) || /^3\d\d$/.test(httpCode);
  const line = `${reachable ? "OK" : "FAIL"}\t${httpCode}\t${item.platform}\t${item.title}\t${item.url}`;
  console[reachable ? "log" : "error"](line);
  if (!reachable) hasFailure = true;
}

if (hasFailure) {
  console.error("\nVideo audit failed. Remove or replace videos that are not currently reachable before deployment.");
  process.exit(1);
}

console.log(`\nVideo audit passed: ${videos.length} reachable videos.`);
