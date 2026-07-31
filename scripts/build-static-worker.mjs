import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { extname, join, relative, sep } from "node:path";
import { build } from "vite";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);
const staticDir = new URL("../dist/static/", import.meta.url);
const serverDir = new URL("../dist/server/", import.meta.url);
const hostingPath = new URL("../.openai/hosting.json", import.meta.url);

async function collectFiles(dir, base = dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(full, base, acc);
    } else {
      const route = `/${relative(base, full).split(sep).join("/")}`;
      acc.push({ route, full });
    }
  }
  return acc;
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

await rm(new URL("../dist/", import.meta.url), { recursive: true, force: true });
await build({ root: rootPath, build: { outDir: "dist/static" } });

const files = {};
for (const file of await collectFiles(fileURLToPath(staticDir))) {
  if (file.route.startsWith("/assets/v09/")) continue;
  const data = await readFile(file.full);
  files[file.route] = {
    contentType: mime[extname(file.route).toLowerCase()] ?? "application/octet-stream",
    body: data.toString("base64"),
  };
}

const hosting = await readFile(hostingPath, "utf8");
const worker = `const files = ${JSON.stringify(files)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const worker = {
  async fetch(request) {
    const url = new URL(request.url);
    if (!["GET", "HEAD"].includes(request.method)) {
      return new Response("Method Not Allowed", { status: 405 });
    }
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    let asset = files[pathname];
    if (!asset && !pathname.includes(".")) asset = files["/index.html"];
    if (!asset) return new Response("Not Found", { status: 404 });
    return new Response(request.method === "HEAD" ? null : decodeBase64(asset.body), {
      status: 200,
      headers: {
        "content-type": asset.contentType,
        "cache-control": pathname === "/index.html" ? "no-store" : "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff"
      }
    });
  }
};

export default worker;
`;

await mkdir(serverDir, { recursive: true });
await mkdir(new URL("../dist/.openai/", import.meta.url), { recursive: true });
await writeFile(new URL("../dist/server/index.js", import.meta.url), worker, "utf8");
await writeFile(new URL("../dist/.openai/hosting.json", import.meta.url), hosting, "utf8");
