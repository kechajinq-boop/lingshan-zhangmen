import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = process.cwd();
const targetPath = path.join(root, 'deliverables', 'v011-map-rebuild', 'grounding', 'southeast-extension-v1', 'single-map-roads-3bridges-southeast-extended.png');
const donorPath = 'C:\\Users\\wuqq\\AppData\\Roaming\\Cindy\\codex-home\\generated_images\\019fb1cf-d5ef-7f70-9dd0-a09a592ea71a\\exec-a6010f53-1c1b-45df-a41f-56ead7a5bfba.png';
const dataUrl = file => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;

const repairs = [
  {
    polygon: [[1436,286],[1466,273],[1500,282],[1521,308],[1522,348],[1504,383],[1475,408],[1447,396],[1433,364],[1432,323]],
    blur: 5,
  },
  {
    polygon: [[1467,474],[1501,455],[1551,454],[1583,468],[1600,493],[1597,520],[1574,541],[1532,551],[1491,541],[1468,519]],
    blur: 5,
  },
];

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const output = await page.evaluate(async ({ targetUrl, donorUrl, repairs }) => {
    const load = src => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    const [target, donorInput] = await Promise.all([load(targetUrl), load(donorUrl)]);
    const width = target.width;
    const height = target.height;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(target, 0, 0);

    const donor = document.createElement('canvas');
    donor.width = width;
    donor.height = height;
    donor.getContext('2d').drawImage(donorInput, 0, 0, width, height);

    for (const repair of repairs) {
      const patch = document.createElement('canvas');
      patch.width = width;
      patch.height = height;
      const patchContext = patch.getContext('2d');
      patchContext.drawImage(donor, 0, 0);

      const mask = document.createElement('canvas');
      mask.width = width;
      mask.height = height;
      const maskContext = mask.getContext('2d');
      maskContext.filter = `blur(${repair.blur}px)`;
      maskContext.fillStyle = '#fff';
      maskContext.beginPath();
      repair.polygon.forEach(([x, y], index) => index ? maskContext.lineTo(x, y) : maskContext.moveTo(x, y));
      maskContext.closePath();
      maskContext.fill();

      patchContext.globalCompositeOperation = 'destination-in';
      patchContext.drawImage(mask, 0, 0);
      context.drawImage(patch, 0, 0);
    }
    return canvas.toDataURL('image/png').split(',')[1];
  }, { targetUrl: dataUrl(targetPath), donorUrl: dataUrl(donorPath), repairs });
  fs.writeFileSync(targetPath, Buffer.from(output, 'base64'));
  console.log(`cleaned ${path.relative(root, targetPath)}`);
} finally {
  await browser.close();
}
