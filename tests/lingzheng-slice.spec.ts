import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const sliceUrl = pathToFileURL(
  resolve(process.cwd(), 'public', 'previews', 'lingzheng-index', 'index.html'),
).href;

test('灵证指数切片可查看三种行情并完成出售', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(sliceUrl);
  await expect(page.getByRole('heading', { name: '百草行情 · 灵证指数' })).toBeVisible();
  await expect(page.locator('#price')).toHaveText('12');

  await page.getByRole('button', { name: '狂热高点' }).click();
  await expect(page.locator('#price')).toHaveText('23');
  await page.getByRole('button', { name: '全部出售' }).click();
  await expect(page.locator('#herbs')).toHaveText('20');
  await expect(page.locator('#hudHerbs')).toHaveText('20');
  await expect(page.locator('#result')).toContainText('收入1380灵石');

  await page.locator('#closeMarket').click();
  await expect(page.locator('#marketPanel')).toBeHidden();
  await page.getByRole('button', { name: '灵草 20' }).click();
  await expect(page.locator('#marketPanel')).toBeVisible();

  expect(errors).toEqual([]);
});

test('灵证指数切片适配手机横屏且无页面溢出', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto(sliceUrl);
  await expect(page.getByRole('heading', { name: '百草行情 · 灵证指数' })).toBeVisible();
  const size = await page.evaluate(() => ({
    width: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
    height: [document.documentElement.scrollHeight, document.documentElement.clientHeight],
  }));
  expect(size.width[0]).toBeLessThanOrEqual(size.width[1]);
  expect(size.height[0]).toBeLessThanOrEqual(size.height[1]);
});
