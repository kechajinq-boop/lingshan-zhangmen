import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , input, output, widthArg = '1672', heightArg = '941'] = process.argv;
if (!input || !output) {
  console.error('用法: node scripts/render-local-html.mjs <输入HTML> <输出PNG> [宽] [高]');
  process.exit(2);
}

const inputPath = path.resolve(input);
const outputPath = path.resolve(output);
if (!fs.existsSync(inputPath)) throw new Error(`输入文件不存在: ${inputPath}`);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: Number(widthArg), height: Number(heightArg) }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(inputPath).href, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map(image => image.complete ? Promise.resolve() : new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    })));
  });
  await page.screenshot({ path: outputPath, fullPage: false });
  console.log(`已渲染: ${path.relative(process.cwd(), outputPath)}`);
} finally {
  await browser.close();
}

