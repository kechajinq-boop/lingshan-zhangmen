import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = process.cwd();
const beforePath = path.join(root, 'rollback', 'v011-southeast-grass-cleanup-20260812-173139', 'single-map-roads-3bridges-southeast-extended.png');
const afterPath = path.join(root, 'deliverables', 'v011-map-rebuild', 'grounding', 'southeast-extension-v1', 'single-map-roads-3bridges-southeast-extended.png');
const previewPath = path.join(root, 'deliverables', 'v011-map-rebuild', 'grounding', 'spacious-full-load-v1', 'spacious-48-buildings.html');
const allowed = [
  { left: 1420, top: 260, right: 1540, bottom: 420 },
  { left: 1450, top: 430, right: 1620, bottom: 570 },
];
const dataUrl = file => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1672, height: 941 } });
  const pixels = await page.evaluate(async ({ beforeUrl, afterUrl, allowed }) => {
    const load = src => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    const [before, after] = await Promise.all([load(beforeUrl), load(afterUrl)]);
    const canvas = document.createElement('canvas');
    canvas.width = after.width;
    canvas.height = after.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(before, 0, 0);
    const beforePixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(after, 0, 0);
    const afterPixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let changed = 0;
    let outsideChanged = 0;
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const i = (y * canvas.width + x) * 4;
        const different = beforePixels[i] !== afterPixels[i]
          || beforePixels[i + 1] !== afterPixels[i + 1]
          || beforePixels[i + 2] !== afterPixels[i + 2]
          || beforePixels[i + 3] !== afterPixels[i + 3];
        if (!different) continue;
        changed += 1;
        if (!allowed.some(box => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom)) outsideChanged += 1;
      }
    }
    return {
      before: { width: before.width, height: before.height },
      after: { width: after.width, height: after.height },
      changed,
      outsideChanged,
    };
  }, { beforeUrl: dataUrl(beforePath), afterUrl: dataUrl(afterPath), allowed });

  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`file:///${previewPath.replaceAll('\\', '/')}`);
  await page.waitForLoadState('load');
  const preview = await page.evaluate(() => ({
    buildings: document.querySelectorAll('.building').length,
    fixed: document.querySelectorAll('.fixed').length,
    broken: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.alt),
  }));

  const result = { pixels, preview, errors };
  console.log(JSON.stringify(result, null, 2));
  if (pixels.after.width !== 1672 || pixels.after.height !== 941) throw new Error('unexpected map dimensions');
  if (pixels.outsideChanged !== 0) throw new Error('cleanup changed pixels outside the two approved repair regions');
  if (preview.buildings !== 48 || preview.fixed !== 2 || preview.broken.length || errors.length) throw new Error('full-load preview regression');
} finally {
  await browser.close();
}
