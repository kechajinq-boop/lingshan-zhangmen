import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = process.cwd();
const originalPath = path.join(root, 'deliverables', 'v011-map-rebuild', 'equal-parcel', 'single-map-roads-3bridges-source.png');
const generatedPath = path.join(root, 'deliverables', 'v011-map-rebuild', 'grounding', 'southeast-extension-v1', 'generated-full-edit.png');
const outputPath = path.join(root, 'deliverables', 'v011-map-rebuild', 'grounding', 'southeast-extension-v1', 'single-map-roads-3bridges-southeast-extended.png');

const dataUrl = file => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const pngBase64 = await page.evaluate(async ({ originalUrl, generatedUrl }) => {
    const load = src => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    const [original, generatedInput] = await Promise.all([load(originalUrl), load(generatedUrl)]);
    const width = original.width;
    const height = original.height;
    const output = document.createElement('canvas');
    output.width = width;
    output.height = height;
    const outputContext = output.getContext('2d');
    outputContext.drawImage(original, 0, 0);

    const generated = document.createElement('canvas');
    generated.width = width;
    generated.height = height;
    generated.getContext('2d').drawImage(generatedInput, 0, 0, width, height);

    const mask = document.createElement('canvas');
    mask.width = width;
    mask.height = height;
    const maskContext = mask.getContext('2d');
    const gradient = maskContext.createLinearGradient(1390, 0, 1490, 0);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(255,255,255,1)');
    maskContext.fillStyle = gradient;
    maskContext.beginPath();
    maskContext.moveTo(1475, 535);
    maskContext.lineTo(width, 500);
    maskContext.lineTo(width, 925);
    maskContext.lineTo(1585, 925);
    maskContext.lineTo(1480, 830);
    maskContext.lineTo(1425, 670);
    maskContext.closePath();
    maskContext.fill();

    const patch = document.createElement('canvas');
    patch.width = width;
    patch.height = height;
    const patchContext = patch.getContext('2d');
    patchContext.drawImage(generated, 0, 0);
    patchContext.globalCompositeOperation = 'destination-in';
    patchContext.drawImage(mask, 0, 0);
    outputContext.drawImage(patch, 0, 0);

    return output.toDataURL('image/png').split(',')[1];
  }, { originalUrl: dataUrl(originalPath), generatedUrl: dataUrl(generatedPath) });
  fs.writeFileSync(outputPath, Buffer.from(pngBase64, 'base64'));
  console.log(`generated ${path.relative(root, outputPath)}`);
} finally {
  await browser.close();
}
