// usage: node tools/shoot.mjs <outDir> [url] [desktopStops] [mobileStops]
import { chromium } from 'playwright-core';
import fs from 'fs';
const out = process.argv[2] || 'shots';
const url = process.argv[3] || 'http://localhost:5177/';
const dStops = Number(process.argv[4] || 28), mStops = Number(process.argv[5] || 24);
fs.mkdirSync(out, { recursive: true });
const exe = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1254/chrome-win64/chrome.exe';
const browser = await chromium.launch({ executablePath: exe });
const errors = [];
async function run(name, viewport, mobile, stops) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'no-preference', isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(`${name}: ${m.text()}`); });
  page.on('pageerror', e => errors.push(`${name} pageerror: ${e.message}`));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/${name}-loader.jpg`, type: 'jpeg', quality: 70 });
  await page.waitForTimeout(6500);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = viewport.height;
  for (let i = 0; i < stops; i++) {
    const y = Math.round((H - vh) * i / (stops - 1));
    // step there in a few hops so scrubbed timelines pass through their states
    await page.evaluate(async (y) => {
      const from = window.scrollY;
      for (let k = 1; k <= 4; k++) {
        const t = from + (y - from) * k / 4;
        window.__lenis ? window.__lenis.scrollTo(t, { immediate: true, force: true }) : window.scrollTo(0, t);
        await new Promise(r => setTimeout(r, 60));
      }
    }, y);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${name}-${String(i).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 70 });
  }
  console.log(name, 'height', H);
  await ctx.close();
}
await run('desktop', { width: 1440, height: 900 }, false, dStops);
await run('mobile', { width: 390, height: 844 }, true, mStops);
await browser.close();
console.log(errors.length ? errors.join('\n') : 'no console errors');
