import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);
const serverDir = new URL("../dist/server/", import.meta.url);
const hostingPath = new URL("../.openai/hosting.json", import.meta.url);

await rm(new URL("../dist/", import.meta.url), { recursive: true, force: true });
await build({ root: rootPath, build: { outDir: "dist/client" } });

const hosting = await readFile(hostingPath, "utf8");
const worker = `
const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!["GET", "HEAD"].includes(request.method)) {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || url.pathname.includes(".")) return response;
    const fallback = new URL("/index.html", request.url);
    return env.ASSETS.fetch(new Request(fallback, request));
  }
};

export default worker;
`;

await mkdir(serverDir, { recursive: true });
await mkdir(new URL("../dist/.openai/", import.meta.url), { recursive: true });
await writeFile(new URL("../dist/server/index.js", import.meta.url), worker, "utf8");
await writeFile(new URL("../dist/.openai/hosting.json", import.meta.url), hosting, "utf8");
