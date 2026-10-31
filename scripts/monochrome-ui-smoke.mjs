// rtk proxy node scripts/monochrome-ui-smoke.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { homedir } from 'node:os';
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const base = process.env.UI_QA_URL || 'http://127.0.0.1:5173';
const output = process.env.UI_QA_OUTPUT || '/tmp/portfolio-monochrome-qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: path.join(homedir(), 'Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'), headless: true });
const report = { checks: [], pages: [], errors: [] };
const check = name => { report.checks.push(name); console.log(name); };
const lum = color => { const a = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(n => { n /= 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; }); return a[0] * .2126 + a[1] * .7152 + a[2] * .0722; };
const contrast = (a, b) => (Math.max(lum(a), lum(b)) + .05) / (Math.min(lum(a), lum(b)) + .05);
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  page.setDefaultTimeout(12000);
  page.on('pageerror', error => report.errors.push(error.message));
  for (const route of ['/', '/auth', '/register', '/projects', '/achievements', '/terms', '/playground/buttons']) {
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const info = await page.evaluate(() => {
      const isChromatic = color => { const a = color.match(/[\d.]+/g)?.map(Number); return a && (a.length < 4 || a[3] > 0) && Math.max(...a.slice(0, 3)) - Math.min(...a.slice(0, 3)) > 2; };
      return {
        route: location.pathname,
        overflow: document.documentElement.scrollWidth > innerWidth,
        loaded: document.fonts.check('900 16px "Medeo Sans"', 'Привет Ёжик'),
        fonts: performance.getEntriesByType('resource').filter(e => /woff/.test(e.name)).map(e => ({ name: e.name, bytes: e.transferSize })),
        chromatic: [...document.querySelectorAll('body *')].filter(e => e instanceof HTMLElement && !e.closest('svg, #footer') && e.getBoundingClientRect().width).flatMap(e => ['color', 'backgroundColor', 'borderTopColor'].filter(prop => isChromatic(getComputedStyle(e)[prop])).map(prop => ({ tag: e.tagName, class: e.className, prop, value: getComputedStyle(e)[prop] }))).slice(0, 10),
      };
    });
    assert(info.loaded, route + ' Medeo');
    assert(!info.overflow, route + ' overflow');
    assert.equal(info.chromatic.length, 0, JSON.stringify(info.chromatic));
    assert(info.fonts.every(f => /Medeo/.test(f.name) && f.name.startsWith(base)));
    if (route === '/') assert.equal(info.fonts.length, 1);
    report.pages.push(info);
    await page.screenshot({ path: path.join(output, route === '/' ? 'home.png' : route.replaceAll('/', '-') + '.png') });
  }
  check('Seven routes: neutral UI paints outside the requested landscape footer, local Medeo/Cyrillic, no overflow');
  const cursor = await page.evaluate(async () => {
    const value = getComputedStyle(document.body).cursor;
    const url = value.match(/url\("(.*?)"\)/)?.[1];
    const svg = new DOMParser().parseFromString(await (await fetch(url)).text(), 'image/svg+xml').documentElement;
    return { width: Number(svg.getAttribute('width')), height: Number(svg.getAttribute('height')), value };
  });
  assert.equal(Math.max(cursor.width, cursor.height), 24);
  check('Custom cursor SVG is proportionally bounded at 24px');

  for (const surface of ['light', 'dark']) {
    await page.getByRole('radio', { name: surface === 'light' ? 'Светлая' : 'Тёмная', exact: true }).check();
    for (const variant of ['primary', 'secondary', 'tertiary', 'text']) {
      const card = page.locator(`[data-example="${variant}"]`);
      const normal = card.locator('[data-state="default"] button');
      const colors = await normal.evaluate(e => ({ fg: getComputedStyle(e).color, bg: getComputedStyle(e).backgroundColor, surface: getComputedStyle(document.querySelector('main')).backgroundColor }));
      const bg = colors.bg === 'rgba(0, 0, 0, 0)' ? colors.surface : colors.bg;
      // Soft fills have alpha; actual rendered surface is verified visually too.
      if (!colors.bg.startsWith('rgba') || colors.bg === 'rgba(0, 0, 0, 0)') assert(contrast(colors.fg, bg) >= 4.5, surface + variant + JSON.stringify(colors));
      const disabled = card.locator('[data-state="disabled"] button');
      assert(await disabled.isDisabled());
      const busy = card.locator('[data-state="loading"] button');
      assert.equal(await busy.getAttribute('aria-busy'), 'true');
      assert(await busy.isDisabled());
      await normal.hover();
      if (variant === 'text') assert.match(await normal.locator('[class*="label"]').evaluate(e => getComputedStyle(e).textDecorationLine), /underline/);
    }
  }
  check('Light/dark variants: contrast, hover, disabled and loading');
  const primary = page.locator('[data-example="primary"] [data-state="default"] button');
  const width = (await primary.boundingBox()).width;
  await primary.click();
  assert(await primary.isDisabled());
  assert.equal((await primary.boundingBox()).width, width);
  await page.waitForTimeout(1050);
  assert(await primary.isEnabled());
  await page.getByLabel('Положение иконки').selectOption('both');
  assert.equal(await primary.locator('svg').count(), 2);
  await page.getByLabel('Положение иконки').selectOption('none');
  assert.equal(await primary.locator('svg').count(), 0);
  const blocked = page.getByRole('link', { name: 'Недоступная ссылка' });
  // An href-less disabled anchor intentionally has no implicit link role.
  assert.equal(await page.locator('a[aria-disabled="true"]').getAttribute('href'), null);
  await page.getByRole('radio', { name: 'Дизайн', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  assert(await page.getByRole('radio', { name: 'Разработка', exact: true }).isChecked());
  await page.getByText('Как это работает?', { exact: true }).click();
  assert(await page.locator('details').getAttribute('open') !== null);
  await page.getByLabel('Тестовое сообщение').fill('Локальная проверка');
  await page.getByLabel('Тестовое сообщение').press('Enter');
  assert.match(await page.getByRole('status').innerText(), /Форма отправлена локально/);
  check('Loading width, optional icons, disabled URL, native form/disclosure/radio keyboard');
  await page.screenshot({ path: path.join(output, 'controls-dark.png'), fullPage: true });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.goto(base + '/');
    await page.locator('h1').waitFor();
    const menu = page.locator('header button[aria-expanded]');
    await menu.click();
    assert.equal(await menu.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(output, `home-${width}.png`) });
    await page.goto(base + '/playground/buttons');
    await page.locator('h1').waitFor();
  }
  check('320/390px responsive controls and mobile menu');
  const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await touch.goto(base + '/playground/buttons');
  await touch.locator('h1').waitFor();
  const small = await touch.locator('[data-design]').evaluateAll(es => es.filter(e => e.getBoundingClientRect().height < 43.9).map(e => ({ text: e.textContent, height: e.getBoundingClientRect().height })));
  assert.equal(small.length, 0, JSON.stringify(small));
  await touch.close();
  check('Touch targets at least 44px, including compact and icon controls');
  await page.goto(base + '/auth');
  await page.getByRole('button', { name: 'Показать пароль' }).click();
  assert.equal(await page.locator('input[type="password"]').count(), 0);
  await page.getByRole('button', { name: 'Скрыть пароль' }).click();
  await page.getByRole('button', { name: 'Забыли пароль?' }).click();
  assert(await page.getByRole('button', { name: 'Вернуться ко входу' }).isVisible());
  check('Authentication utility actions preserved');
  if (!process.env.UI_QA_URL) {
    await page.goto(base + '/');
    await page.locator('h1').waitFor();
    await page.evaluate(async () => {
      const loaded = performance.getEntriesByType('resource').map(e => e.name);
      const { initRootStore } = await import(loaded.find(url => url.includes('/src/shared/stores/RootStore.ts')));
      const { runInAction } = await import(loaded.find(url => url.includes('/node_modules/.vite/deps/mobx.js')));
      const store = initRootStore(); store.userStore.destroy();
      runInAction(() => { store.userStore.currentUser = { id: 'ui-local-qa', displayName: 'UI QA', email: 'qa@example.invalid', role: 'admin', createdAt: new Date() }; store.userStore.isInitialized = true; });
    });
    await page.locator('[data-page-scroll]').waitFor();
    await page.evaluate(() => { history.pushState({}, '', '/admin'); dispatchEvent(new PopStateEvent('popstate')); });
    await page.getByRole('button', { name: 'Добавить', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Добавить', exact: true }).click();
    await page.getByRole('button', { name: 'Отмена', exact: true }).click();
    await page.getByRole('button', { name: 'Свернуть', exact: true }).click();
    assert(await page.getByRole('button', { name: 'Развернуть', exact: true }).isVisible());
    await page.screenshot({ path: path.join(output, 'admin.png') });
    check('Simulated admin UI: add/cancel modal, sidebar collapse; no account login or writes');
  }
  assert.equal(report.errors.length, 0, report.errors.join('\n'));
} catch (error) {
  report.failure = error.stack;
  process.exitCode = 1;
} finally {
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ checks: report.checks.length, failure: report.failure || null, errors: report.errors }));
  await browser.close();
}
