// Run against the local dev server: rtk proxy node scripts/medeo-film-smoke.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { homedir } from 'node:os';

const require = createRequire(import.meta.url);
const { chromium } = require(path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const output = process.env.MEDEO_QA_OUTPUT || '/tmp/portfolio-medeo-film-qa';
const base = process.env.MEDEO_QA_URL || 'http://127.0.0.1:5173';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.HERO_CHROME || path.join(homedir(), 'Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const report = { checks: [], pages: [], errors: [] };
const check = (name) => report.checks.push(name);
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => report.errors.push(error.message));
  for (const route of ['/', '/auth', '/register', '/projects', '/achievements', '/terms', '/playground/buttons']) {
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const info = await page.evaluate(() => ({
      route: location.pathname,
      family: getComputedStyle(document.body).fontFamily,
      sansReady: document.fonts.check('400 16px "Medeo Sans"', 'Привет, Ёжик! Hello 123 ₽'),
      boldReady: document.fonts.check('900 16px "Medeo Sans"', 'Заголовок'),
      fonts: performance.getEntriesByType('resource').filter(e => /\.(woff2?|ttf)/.test(e.name)).map(e => ({ url: e.name, transfer: e.transferSize })),
      overflow: document.documentElement.scrollWidth > innerWidth,
      incorrectButtons: [...document.querySelectorAll('[data-design="film"]')].filter(e => getComputedStyle(e).color !== 'rgb(0, 0, 0)').map(e => e.textContent),
      incorrectText: [...document.querySelectorAll('[data-design="film"] p')].filter(e => getComputedStyle(e).color !== 'rgb(0, 0, 0)').map(e => e.textContent),
    }));
    assert(info.sansReady && info.boldReady, route + ' font not loaded');
    assert(info.family.startsWith('"Medeo Sans"'));
    assert(!info.overflow, route + ' overflow');
    assert.equal(info.incorrectButtons.length, 0, JSON.stringify(info.incorrectButtons));
    assert.equal(info.incorrectText.length, 0, JSON.stringify(info.incorrectText));
    assert(info.fonts.every(e => e.url.includes('Medeo') && e.url.startsWith(base)), 'Unwanted/external font');
    assert(!info.fonts.some(e => /Italic|Pretendard|Caveat/.test(e.url)), 'Unused font was fetched');
    if (route === '/') assert.equal(info.fonts.length, 1, 'Home should request the preloaded Sans once');
    report.pages.push(info);
    await page.screenshot({ path: path.join(output, (route === '/' ? 'home' : route.replaceAll('/', '-')) + '.png'), fullPage: false });
  }
  check('Seven routes: Medeo loaded incl Cyrillic/900, local fonts only, no overflow, Film black text');

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument');
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'h1' });
  const platform = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
  assert(platform.fonts.some(f => /Medeo/i.test(f.familyName) && f.isCustomFont), JSON.stringify(platform));
  check('Chrome confirms actual custom Medeo glyph rendering, not just a CSS family name');

  const sample = page.locator('[data-direction="film"] [data-state="default"] [data-variant="primary"]');
  await sample.hover();
  await page.waitForTimeout(250);
  assert.equal(await sample.evaluate(e => getComputedStyle(e).color), 'rgb(0, 0, 0)');
  await sample.click();
  assert(await sample.isDisabled());
  assert.equal(await sample.getAttribute('aria-busy'), 'true');
  await page.waitForTimeout(1300);
  assert(await sample.isEnabled());
  await sample.focus();
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('data-variant'), 'secondary');
  check('Film hover/loading/pause-width behavior and keyboard focus');

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base + '/');
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    // The accessible name changes to "Закрыть меню" after opening.
    const toggle = page.locator('header button[aria-expanded]');
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    await page.screenshot({ path: path.join(output, `mobile-${width}.png`) });
  }
  check('320/390px: font layout, Film controls and mobile menu open/Escape');

  await page.goto(base + '/auth');
  await page.getByRole('heading', { level: 1 }).waitFor();
  const password = page.locator('input[type="password"]');
  await password.fill('local-test-value');
  await page.getByRole('button', { name: 'Показать пароль' }).click();
  assert.equal(await page.locator('input[value="local-test-value"]').count(), 1);
  assert.equal(await password.count(), 0);
  await page.getByRole('button', { name: 'Скрыть пароль' }).click();
  assert.equal(await password.count(), 1);
  await page.getByRole('button', { name: 'Забыли пароль?' }).click();
  assert(await page.getByRole('button', { name: 'Вернуться ко входу' }).isVisible());
  check('Auth utility buttons retain password toggle and reset navigation');

  const license = await page.request.get(base + '/fonts/medeo/OFL.txt');
  assert.equal(license.status(), 200);
  assert.match(await license.text(), /SIL OPEN FONT LICENSE Version 1.1/);
  assert.match(await license.text(), /Copyright 2026 The Medeo Project Authors/);
  check('Full upstream OFL/copyright shipped publicly with the font');

  assert.equal(report.errors.length, 0, report.errors.join('\n'));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  await browser.close();
}
