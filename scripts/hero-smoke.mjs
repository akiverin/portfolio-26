// Browser regression checks for the live Hero; no production instrumentation is added.
// Run: rtk proxy node scripts/hero-smoke.mjs
// Optional: HERO_URL, HERO_CHROME, HERO_QA_MODULES, HERO_QA_OUTPUT.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const modules = process.env.HERO_QA_MODULES || path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { chromium } = require(path.join(modules, 'playwright'));
const { PNG } = require(path.join(modules, 'pngjs'));
const output = path.resolve(process.env.HERO_QA_OUTPUT || 'assets/hero-explorations/ascii-cinema-4k/implementation/qa');
const origin = process.env.HERO_URL || 'http://localhost:5173';
const chrome = process.env.HERO_CHROME || path.join(homedir(), 'Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = { date: new Date().toISOString(), origin, environment: 'Headless Chromium with SwiftShader software WebGL; timing is not a hardware GPU FPS guarantee.', checks: [], pageErrors: [], consoleErrors: [] };
if(process.env.HERO_QA_TAIL) {
  const prior=JSON.parse(await readFile(path.join(output,'report.json'),'utf8'));
  report.checks=prior.checks;report.pageErrors=prior.pageErrors;report.consoleErrors=prior.consoleErrors;
  report.continuation='Public checks retained from immediately preceding run; remaining checks resumed after correcting test-only Vite module URL identity.';
}
const check = (name, details) => report.checks.push({ name, passed: true, ...details });
const pixelsChanged = (before, after) => {
  const a = PNG.sync.read(before), b = PNG.sync.read(after);
  assert.equal(a.width, b.width); assert.equal(a.height, b.height);
  let changed = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    if (Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]) > 15) changed++;
  }
  return Number((changed / (a.width * a.height) * 100).toFixed(4));
};
async function instrument(page, disableWebgl = false) {
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  await page.addInitScript(({ disableWebgl }) => {
    window.__heroQA = { draws: 0, drawTimes: [], longTasks: [], uniforms:{} };
    for (const type of ['WebGLRenderingContext', 'WebGL2RenderingContext']) {
      const proto = window[type]?.prototype;
      if (!proto) continue;
      const names=new WeakMap();
      const find=proto.getUniformLocation;
      proto.getUniformLocation=function(program,name){const location=find.call(this,program,name);if(location)names.set(location,name);return location;};
      for(const method of ['uniform1f','uniform2f']) {
        const originalUniform=proto[method];
        proto[method]=function(location,...values){const name=location&&names.get(location);if(name)window.__heroQA.uniforms[name]=values;return originalUniform.call(this,location,...values);};
      }
      const original = proto.drawArrays;
      proto.drawArrays = function (...args) {
        const start = performance.now();
        const result = original.apply(this, args);
        window.__heroQA.draws++;
        window.__heroQA.drawTimes.push(performance.now() - start);
        return result;
      };
    }
    if (disableWebgl) {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return /webgl/i.test(type) ? null : original.call(this, type, ...args);
      };
    }
    if ('PerformanceObserver' in window) {
      new PerformanceObserver(entries => {
        window.__heroQA.longTasks.push(...entries.getEntries().map(({ duration, startTime }) => ({ duration, startTime })));
      }).observe({ type: 'longtask', buffered: true });
    }
  }, { disableWebgl });
}
async function load(page, { keepNotice=false } = {}) {
  await page.goto(origin, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.locator('[data-ascii-landscape]:not([data-renderer="loading"])').waitFor();
  await page.waitForTimeout(2400);
  const notice = page.getByRole('button', {name:'Скрыть уведомление'});
  if(!keepNotice && await notice.isVisible()) {await notice.click();await page.waitForTimeout(300);}
}
async function layout(page, label) {
  const dimensions = await page.evaluate(() => {
    const hero = document.querySelector('h1')?.closest('section');
    const rect = hero?.getBoundingClientRect();
    const title = document.querySelector('h1')?.getBoundingClientRect();
    return { viewport: [innerWidth, innerHeight], documentWidth: document.documentElement.scrollWidth, hero: rect && { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, title: title && { x: title.x, y: title.y, right: title.right, bottom: title.bottom }, canvas: hero?.querySelector('canvas') && { width: hero.querySelector('canvas').width, height: hero.querySelector('canvas').height }, headings: document.querySelectorAll('h1').length };
  });
  assert(dimensions.documentWidth <= dimensions.viewport[0] + 1, `${label}: horizontal document overflow`);
  assert.equal(dimensions.headings, 1, `${label}: expected one h1`);
  if(dimensions.canvas) assert(dimensions.canvas.width*dimensions.canvas.height<=3_010_000,`${label}: canvas exceeds 3M pixel budget`);
  assert(dimensions.title.x >= 0 && dimensions.title.right <= dimensions.viewport[0] + 1, `${label}: title clipped horizontally`);
  await page.screenshot({ path: path.join(output, `${label}.png`), fullPage: false });
  check(label, dimensions);
}
async function drawCount(page) { return page.evaluate(() => window.__heroQA.draws); }

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await instrument(page); await load(page,{keepNotice:true});
  if(!process.env.HERO_QA_TAIL) {
  const firstNotice=page.getByRole('button',{name:'Скрыть уведомление'});
  if(await firstNotice.isVisible()) {
    await page.getByRole('button',{name:'Остановить анимацию фона'}).click();
    await page.locator('[data-ascii-landscape][data-motion="paused"]').waitFor();
    await page.getByRole('button',{name:'Включить анимацию фона'}).click();
    check('pause-control-clickable-with-announcement');
    await firstNotice.click();await page.waitForTimeout(300);
  }
  assert.match(await page.getByRole('heading', { level: 1 }).innerText(), /Создаю сайты/);
  await layout(page, 'desktop-1440');
  const heroCanvas = page.locator('section').filter({ has: page.locator('h1') }).locator('canvas');
  assert.equal(await heroCanvas.count(), 1, 'Hero must contain one canvas');
  // Locator screenshots also include HTML above the canvas; mask text/mascot/control
  // overlays so hover styling cannot be mistaken for background motion.
  const captureScene=()=>heroCanvas.screenshot({mask:[page.locator('[class*="hero__topline"], [class*="hero__content"], [class*="hero__mascot"], [class*="hero__footer"]')]});
  const before = await captureScene();
  const countBefore = await drawCount(page);
  await page.waitForTimeout(1200);
  const after = await captureScene();
  const animationDifference = pixelsChanged(before, after);
  assert(animationDifference > 0.03, 'Scene pixels should change at rest');
  const countAfter = await drawCount(page);
  assert(countAfter > countBefore, 'GPU draw loop should progress');
  check('live-ascii-animation', { changedPixelsPercent: animationDifference, drawsIn1200ms: countAfter - countBefore });
  await page.getByRole('button',{name:'Остановить анимацию фона'}).click();await page.waitForTimeout(350);
  const pointerBefore=await captureScene();
  await page.mouse.move(1300,220);await page.waitForTimeout(350);
  await page.mouse.move(200,760);await page.waitForTimeout(350);
  const pointerDifference=pixelsChanged(pointerBefore,await captureScene());
  assert.equal(pointerDifference,0,'Pointer movement must not move the paused scene: parallax is scroll-only');
  check('no-pointer-parallax',{changedPixelsPercent:pointerDifference});
  await page.getByRole('button',{name:'Включить анимацию фона'}).click();await page.waitForTimeout(350);
  await page.mouse.move(1300,220);await page.screenshot();await page.waitForTimeout(350);
  const pointerInput=await page.evaluate(()=>window.__heroQA.uniforms.u_pointer);
  assert(!pointerInput || pointerInput.every(value=>Math.abs(value)<0.00001),'Full-motion scene must not receive mouse parallax offsets');

  await page.evaluate(()=>window.scrollTo({top:300,behavior:'instant'}));await page.screenshot();await page.waitForTimeout(500);
  const scrollUniform=await page.evaluate(()=>window.__heroQA.uniforms.u_scroll?.[0]);
  assert(scrollUniform>0.1,'Document scrolling should drive shader depth input');
  check('scroll-parallax',{shaderScroll:scrollUniform});

  await page.evaluate(() => window.scrollTo({top: innerHeight * 1.5, behavior:'instant'}));
  await page.screenshot();
  await page.waitForFunction(() => document.querySelector('[data-ascii-landscape]')?.dataset.animating === 'false');
  const offscreenBefore = await drawCount(page); await page.waitForTimeout(700);
  assert.equal(await drawCount(page), offscreenBefore, 'Offscreen Hero must stop drawing');
  check('offscreen-pause');
  await page.evaluate(() => window.scrollTo({top: 0, behavior:'instant'}));await page.screenshot(); await page.waitForTimeout(300);
  const returnBefore = await drawCount(page); await page.waitForTimeout(400);
  assert((await drawCount(page)) > returnBefore, 'Revealed Hero must resume');
  check('onscreen-resume');

  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(500);
  const reducedBefore = await drawCount(page); const reducedImage = await captureScene();
  await page.waitForTimeout(700); await page.mouse.move(800, 300); await page.waitForTimeout(300);
  assert.equal(await drawCount(page), reducedBefore, 'Reduced-motion preference must stop animation and pointer work');
  const reducedDifference = pixelsChanged(reducedImage, await captureScene());
  assert.equal(reducedDifference, 0, 'Reduced-motion scene should remain static');
  check('runtime-reduced-motion', { changedPixelsPercent: reducedDifference });
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(500);

  const pauseButton = page.getByRole('button', { name:'Остановить анимацию фона' });
  await pauseButton.click(); await page.waitForTimeout(350);
  const pausedBefore=await drawCount(page); await page.waitForTimeout(500);
  assert.equal(await drawCount(page), pausedBefore, 'Explicit pause must stop the renderer');
  await page.getByRole('button',{name:'Включить анимацию фона'}).click(); await page.waitForTimeout(350);
  assert((await drawCount(page))>pausedBefore,'Explicit resume must restart drawing');
  check('user-pause-resume');

  // Simulates visibility notifications without freezing the test process itself.
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForTimeout(300); const hiddenBefore = await drawCount(page); await page.waitForTimeout(500);
  assert.equal(await drawCount(page), hiddenBefore, 'Hidden-tab notification must stop drawing');
  await page.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForTimeout(300);
  check('document-visibility-pause', { method: 'Simulated document hidden/visibilitychange' });

  const timing = await page.evaluate(async () => {
    const startDraws = window.__heroQA.draws, started = performance.now(), frames = [], tasksStart = window.__heroQA.longTasks.length;
    let previous = started;
    await new Promise(resolve => { const timeout=setTimeout(resolve,3000);const sample = now => { frames.push(now - previous); previous = now; if (now - started < 2500) requestAnimationFrame(sample); else {clearTimeout(timeout);resolve();} }; requestAnimationFrame(sample); });
    frames.sort((a,b) => a-b);
    const drawTimes = window.__heroQA.drawTimes.slice(-100).sort((a,b) => a-b);
    return { sampleMs: performance.now() - started, draws: window.__heroQA.draws - startDraws, compositorRafMedianMs: frames[Math.floor(frames.length*.5)], compositorRafP95Ms: frames[Math.floor(frames.length*.95)], cpuDrawSubmissionP95Ms: drawTimes[Math.floor(drawTimes.length*.95)], longTasks: window.__heroQA.longTasks.slice(tasksStart) };
  });
  check('steady-state-timing', timing);

  for (const size of [{width:3840,height:2160},{width:1920,height:1080},{width:768,height:1024},{width:390,height:844},{width:320,height:640},{width:844,height:390}]) {
    await page.setViewportSize(size); await page.waitForTimeout(500); await layout(page, `responsive-${size.width}x${size.height}`);
  }
  await page.setViewportSize({width:1440,height:1000}); await page.waitForTimeout(300);
  // Exercise the actual DOM anchor links rather than editing the hash by hand.
  for (const hash of ['#projects', '#contact']) {
    await page.evaluate(() => window.scrollTo(0, 0));
    const link = page.locator('section').filter({has:page.locator('h1')}).locator(`a[href="/${hash}"]`).first();
    await link.click(); await page.waitForTimeout(700);
    assert.equal(new URL(page.url()).hash, hash);
    const top = await page.locator(hash).evaluate(el => el.getBoundingClientRect().top);
    assert(top < 200 && top > -200, `Anchor ${hash} should be brought into view (top ${top})`);
    check(`anchor-${hash.slice(1)}`, { targetTop: top });
    await page.goto(origin); await page.waitForTimeout(1000);
  }
  }

  const currentNotice=page.getByRole('button',{name:'Скрыть уведомление'});if(await currentNotice.isVisible()){await currentNotice.click();await page.waitForTimeout(300);}
  await page.setViewportSize({width:768,height:1024});await page.waitForTimeout(600);
  await layout(page,'responsive-768x1024');
  const overlap=await page.evaluate(()=>{
    const mascot=document.querySelector('[class*="hero__mascot"]').getBoundingClientRect();
    return [...document.querySelectorAll('[class*="hero__actions"] a')].reduce((sum,link)=>{
      const action=link.getBoundingClientRect();
      return sum+Math.max(0,Math.min(mascot.right,action.right)-Math.max(mascot.left,action.left))*Math.max(0,Math.min(mascot.bottom,action.bottom)-Math.max(mascot.top,action.top));
    },0);
  });
  assert.equal(overlap,0,'Tablet mascot should clear CTA controls');check('tablet-mascot-clears-actions',{overlapPx:overlap});
  await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(500);

  // This only simulates the authenticated shell store, without logging into any real account.
  await page.evaluate(async () => {
    // Vite imports include a timestamp/version. Importing the bare path would
    // create a second module singleton instead of updating the mounted store.
    const loaded=performance.getEntriesByType('resource').map(entry=>entry.name);
    const {initRootStore} = await import(loaded.find(url=>url.includes('/src/shared/stores/RootStore.ts')));
    const {runInAction} = await import(loaded.find(url=>url.includes('/node_modules/.vite/deps/mobx.js')));
    const store = initRootStore();
    store.userStore.destroy();
    runInAction(()=>{store.userStore.currentUser = { id:'hero-layout-qa', displayName:'Hero QA', email:'qa@example.invalid', role:'user', createdAt:new Date() };store.userStore.isInitialized = true;});
  });
  await page.waitForSelector('[data-page-scroll]'); await page.waitForTimeout(500);
  await layout(page, 'authenticated-shell-simulated');
  await page.locator('[data-page-scroll]').evaluate(el=>el.scrollTop=300);await page.screenshot();await page.waitForTimeout(500);
  const internalScroll=await page.evaluate(()=>window.__heroQA.uniforms.u_scroll?.[0]);assert(internalScroll>0.1,'Internal scroller must drive shader parallax');check('internal-scroller-parallax',{shaderScroll:internalScroll,simulatedUser:true});
  await page.locator('[data-page-scroll]').evaluate(el=>el.scrollTop=1200);await page.screenshot(); await page.waitForTimeout(500);
  const internalBefore = await drawCount(page); await page.waitForTimeout(500);
  assert.equal(await drawCount(page), internalBefore, 'Internal authenticated scroller offscreen must pause drawing');
  check('internal-scroller-offscreen-pause', { simulatedUser:true });
  await page.close();

  const phone=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});await instrument(phone);await load(phone);
  await layout(phone,'touch-phone-390-dpr3');
  const mobileQuality=await phone.locator('[data-ascii-landscape]').getAttribute('data-quality');
  assert(Number(mobileQuality)<=1,'Touch screen rendering should cap backing pixel ratio');check('touch-quality-cap',{ratio:Number(mobileQuality)});await phone.close();

  const reducedInitial=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await instrument(reducedInitial);await load(reducedInitial);
  const staticBefore=await drawCount(reducedInitial);await reducedInitial.waitForTimeout(700);assert.equal(await drawCount(reducedInitial),staticBefore,'Initially reduced-motion scene must not start an animation loop');
  assert.equal(await reducedInitial.locator('[data-ascii-landscape]').getAttribute('data-motion'),'reduced');check('initial-reduced-motion-no-loop');await reducedInitial.close();

  const contextLoss=await browser.newPage({viewport:{width:1440,height:1000}}); await instrument(contextLoss); await load(contextLoss);
  await contextLoss.locator('[data-ascii-landscape] canvas').evaluate(canvas=>{window.__lostExtension=canvas.getContext('webgl')?.getExtension('WEBGL_lose_context');window.__lostExtension?.loseContext();});
  await contextLoss.locator('[data-ascii-landscape][data-renderer="fallback"]').waitFor();
  await contextLoss.waitForTimeout(350);const lostBefore=await drawCount(contextLoss);await contextLoss.waitForTimeout(500);
  assert.equal(await drawCount(contextLoss),lostBefore,'Lost WebGL context must stop rendering');
  await layout(contextLoss,'webgl-context-loss-fallback');check('webgl-context-loss-no-loop');
  await contextLoss.evaluate(()=>window.__lostExtension?.restoreContext());
  await contextLoss.locator('[data-ascii-landscape][data-renderer="webgl"]').waitFor();await contextLoss.screenshot();await contextLoss.waitForTimeout(500);
  assert((await drawCount(contextLoss))>lostBefore,'Restored WebGL context should rebuild rendering');check('webgl-context-restoration');await contextLoss.close();

  const fallback = await browser.newPage({viewport:{width:1440,height:1000}}); await instrument(fallback,true); await load(fallback);
  await layout(fallback,'webgl-unavailable-fallback');
  assert.equal(await drawCount(fallback),0); check('webgl-unavailable-no-loop');
  await fallback.close();
  if(process.env.HERO_PRODUCTION_URL) {
    const production=await browser.newPage({viewport:{width:1440,height:1000}});await instrument(production);
    await production.goto(process.env.HERO_PRODUCTION_URL,{waitUntil:'domcontentloaded'});
    await production.locator('[data-ascii-landscape][data-renderer="webgl"]').waitFor();await production.waitForTimeout(1800);
    assert.match(await production.getByRole('heading',{level:1}).innerText(),/Создаю сайты/);
    await production.getByRole('button',{name:'Остановить анимацию фона'}).click();await production.locator('[data-ascii-landscape][data-motion="paused"]').waitFor();
    await production.getByRole('button',{name:'Включить анимацию фона'}).click();await production.locator('[data-ascii-landscape][data-animating="true"]').waitFor();
    await layout(production,'production-build-desktop');check('production-build-webgl-pause-resume',{url:process.env.HERO_PRODUCTION_URL});await production.close();
  }
  assert.equal(report.pageErrors.length,0,`Unexpected uncaught errors: ${report.pageErrors.join('; ')}`);
  check('no-uncaught-errors');
} catch(error) {
  report.failure = error.stack || String(error);
  process.exitCode=1;
} finally {
  report.checks=[...new Map(report.checks.map(result=>[result.name,result])).values()];
  await writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({passed:report.checks.length,pageErrors:report.pageErrors,consoleErrors:report.consoleErrors,failure:report.failure||null,report:path.join(output,'report.json')},null,2));
  await browser.close();
}
