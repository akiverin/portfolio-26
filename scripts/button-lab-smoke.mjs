// Run with the dev server: rtk proxy node scripts/button-lab-smoke.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const modules = process.env.HERO_QA_MODULES || path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { chromium } = require(path.join(modules, 'playwright'));
const output = path.resolve(process.env.BUTTON_QA_OUTPUT || '/tmp/portfolio-button-lab-qa');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.HERO_CHROME || path.join(homedir(), 'Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
  headless: true,
});
const report = { checks: [], errors: [], contrast: [] };
const check = (name) => report.checks.push(name);
const luminance = (color) => {
  const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
};
const contrast = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.on('pageerror', error => report.errors.push(error.message));
  await page.goto(process.env.BUTTON_LAB_URL || 'http://127.0.0.1:5173/playground/buttons');
  await page.getByRole('heading', { level: 1 }).waitFor();
  assert.equal(await page.locator('[data-direction]').count(), 5);
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow');
  assert.equal(await page.locator('[data-hero]').count(), 0);
  check('Five isolated visual directions; noindex test page');

  for (const design of ['studio', 'cobalt', 'press', 'circuit', 'film']) {
    const section = page.locator(`[data-direction="${design}"]`);
    for (const variant of ['primary', 'secondary', 'icon']) {
      const button = section.locator(`[data-state="default"] [data-variant="${variant}"]`);
      const colors = () => button.evaluate(e => ({ text: getComputedStyle(e).color, background: getComputedStyle(e).backgroundColor }));
      const normal = await colors();
      assert(contrast(normal.text, normal.background) >= 4.5, `${design}/${variant}: contrast too low`);
      await button.hover();
      await page.waitForTimeout(240);
      const hover = await colors();
      assert(contrast(hover.text, hover.background) >= 4.5, `${design}/${variant}: hover contrast too low`);
      assert.notEqual(normal.background, hover.background, `${design}/${variant}: missing hover`);
      report.contrast.push({ design, variant, default: contrast(normal.text, normal.background).toFixed(2), hover: contrast(hover.text, hover.background).toFixed(2) });
      const blocked = section.locator(`[data-state="disabled"] [data-variant="${variant}"]`);
      assert(await blocked.isDisabled());
      const status = await page.getByRole('status').innerText();
      await blocked.evaluate(e => e.click());
      assert.equal(await page.getByRole('status').innerText(), status);
      const loading = section.locator(`[data-state="loading"] [data-variant="${variant}"]`);
      assert(await loading.isDisabled());
      assert.equal(await loading.getAttribute('aria-busy'), 'true');
      if (variant === 'icon') assert(await button.getAttribute('aria-label'));
    }
    const primary = section.locator('[data-state="default"] [data-variant="primary"]');
    const widthBefore = (await primary.boundingBox()).width;
    await primary.click();
    assert.equal(await primary.getAttribute('aria-busy'), 'true');
    assert.equal((await primary.boundingBox()).width, widthBefore, 'Loading must preserve width');
    await page.waitForTimeout(1250);
    assert(await primary.isEnabled());
    const icon = section.locator('[data-state="default"] [data-variant="icon"]');
    await icon.click();
    assert.equal(await icon.getAttribute('aria-pressed'), 'true');
    await icon.click();
    assert.equal(await icon.getAttribute('aria-pressed'), 'false');
    check(`${design}: contrast, hover, disabled, loading width, click and toggle`);
  }

  await page.getByLabel('Иконка', { exact: true }).selectOption('lightning');
  await page.getByLabel('Положение').selectOption('both');
  const studio = page.locator('[data-direction="studio"] [data-state="default"] [data-variant="primary"]');
  assert.equal(await studio.locator('svg').count(), 2);
  await page.getByLabel('Положение').selectOption('none');
  assert.equal(await studio.locator('svg').count(), 0);
  await page.getByLabel('Положение').selectOption('start');
  assert.equal(await studio.locator('svg').count(), 1);
  await page.getByLabel('Disabled', { exact: true }).check();
  assert.equal(await page.locator('[data-state="default"] button:disabled').count(), 15);
  await page.getByLabel('Disabled', { exact: true }).uncheck();
  await page.getByLabel('Loading', { exact: true }).check();
  assert.equal(await page.locator('[data-state="default"] button[aria-busy="true"]').count(), 15);
  await page.getByLabel('Loading', { exact: true }).uncheck();
  await page.getByLabel('Тёмный фон').check();
  assert.equal(await page.locator('[data-dark]').count(), 5);
  await page.getByLabel('Тёмный фон').uncheck();
  check('Live size/icon/placement/disabled/loading/background controls');

  const secondary = page.locator('[data-direction="studio"] [data-state="default"] [data-variant="secondary"]');
  await secondary.focus();
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('data-variant'), 'icon');
  assert(await page.locator(':focus').evaluate(e => e.matches(':focus-visible') && getComputedStyle(e).outlineStyle !== 'none'));
  await page.keyboard.press('Space');
  assert.equal(await page.locator(':focus').getAttribute('aria-pressed'), 'true');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator(':focus').getAttribute('aria-pressed'), 'false');
  check('Keyboard Tab focus ring, Space and Enter activation; disabled rows skipped');

  await page.getByLabel('Тестовое сообщение').fill('Проверка');
  await page.getByLabel('Тестовое сообщение').press('Enter');
  assert.match(await page.getByRole('status').innerText(), /Форма отправлена локально/);
  await page.locator('[data-direction="cobalt"]').getByRole('button', { name: 'Выбрать', exact: true }).click();
  await page.locator('[data-direction="film"]').getByRole('button', { name: 'Выбрать', exact: true }).click();
  assert.equal(await page.locator('[data-direction="film"]').getAttribute('data-selected'), 'true');
  assert.match(await page.locator('pre').innerText(), /design="film"/);
  check('Native form submit; local design selection');

  await page.getByLabel('Положение').selectOption('end');
  await page.mouse.move(0, 0);
  await page.screenshot({ path: path.join(output, 'desktop.png'), fullPage: true });
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.getByLabel('Размер').selectOption('lg');
    await page.getByLabel('Положение').selectOption('both');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Document overflow at ${width}`);
    const clipped = await page.locator('[data-design]').evaluateAll(es => es.filter(e => {
      const a = e.getBoundingClientRect(), b = e.parentElement.getBoundingClientRect();
      return a.right > b.right + 1 || a.left < b.left - 1;
    }).length);
    assert.equal(clipped, 0, `Buttons clipped at ${width}`);
    await page.screenshot({ path: path.join(output, `mobile-${width}.png`), fullPage: true });
  }
  check('Responsive 768/390/320px; large size and two icons without clipping');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const spinner = page.locator('[data-loading] [class*="spinner"]').first();
  assert.equal(await spinner.evaluate(e => getComputedStyle(e).animationName), 'none');
  check('Reduced motion: no continuous spinner animation');
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  const touch = await mobile.newPage();
  await touch.goto(process.env.BUTTON_LAB_URL || 'http://127.0.0.1:5173/playground/buttons');
  await touch.getByRole('heading', { level: 1 }).waitFor();
  await touch.getByLabel('Размер').selectOption('sm');
  assert(await touch.locator('[data-state="default"] button').evaluateAll(es => es.every(e => e.getBoundingClientRect().height >= 44)));
  check('Touch: minimum 44px targets for small buttons');
  await mobile.close();
  assert.equal(report.errors.length, 0, report.errors.join('\n'));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  await browser.close();
}
