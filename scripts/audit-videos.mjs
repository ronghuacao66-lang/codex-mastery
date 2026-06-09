import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const videosPath = path.join(root, "data", "videos.json");
const videos = JSON.parse(await readFile(videosPath, "utf8"));

let hasFailure = false;

function bvidFromUrl(url) {
  return url.match(/\/video\/(BV[a-zA-Z0-9]+)/)?.[1];
}

async function checkBilibiliVideo(url) {
  const bvid = bvidFromUrl(url);
  if (!bvid) return { ok: false, bvid: "missing", code: "missing", title: "" };

  const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {
    headers: {
      Referer: "https://www.bilibili.com/",
      "User-Agent": "Mozilla/5.0"
    },
    signal: AbortSignal.timeout(20000)
  });
  const payload = await response.json();
  return {
    ok: payload.code === 0,
    bvid,
    code: String(payload.code),
    title: payload.data?.title ?? payload.message ?? ""
  };
}

for (const item of videos) {
  if (item.platform !== "Bilibili") {
    hasFailure = true;
    console.error(`FAIL\tplatform=${item.platform}\t${item.title}`);
    continue;
  }

  const linkStatus = item.linkStatus?.status;
  if (linkStatus !== "ok") {
    hasFailure = true;
    console.error(`FAIL\tstatus=${linkStatus ?? "missing"}\t${item.platform}\t${item.title}`);
    continue;
  }

  try {
    const result = await checkBilibiliVideo(item.url);
    const line = `${result.ok ? "OK" : "FAIL"}\tcode=${result.code}\t${result.bvid}\t${item.title}\t${result.title}`;
    console[result.ok ? "log" : "error"](line);
    if (!result.ok) hasFailure = true;
  } catch (error) {
    hasFailure = true;
    console.error(`FAIL\tapi_error\t${item.title}\t${error.message}`);
  }
}

if (hasFailure) {
  console.error("\nVideo audit failed. Remove or replace Bilibili videos that no longer return code=0 before deployment.");
  process.exit(1);
}

console.log(`\nVideo audit passed: ${videos.length} Bilibili videos exist.`);
