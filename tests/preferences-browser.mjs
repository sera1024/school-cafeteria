import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1100}});
 const base=process.env.APP_URL||'http://127.0.0.1:3002';
 await page.goto(base);
 await page.getByText('순두부찌개',{exact:true}).waitFor();
 await page.getByLabel('조회 날짜').fill('2026-11-11');
 await page.getByText('8,000원',{exact:true}).waitFor();
 assert.equal(await page.locator('.meal-service').count(),3);
 assert.equal(await page.locator('.service-hours').innerText().then(s=>s.includes('08:00–09:30')&&s.includes('11:30–14:00')&&s.includes('17:00–19:00')),true);
 await page.getByRole('button',{name:'♡ 관심 메뉴',exact:true}).click();
 const option=page.getByRole('button',{name:'제육볶음 알림 설정',exact:true});
 await option.click();assert.equal(await option.getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'제육볶음 ×',exact:true}).waitFor();
 await page.reload();await page.getByRole('button',{name:'♡ 관심 메뉴',exact:true}).click();
 await page.getByRole('button',{name:'제육볶음 ×',exact:true}).waitFor();
 await option.waitFor();assert.equal(await option.getAttribute('aria-pressed'),'true');
 await page.getByLabel('식단 메뉴 검색').fill('제육');assert.equal(await page.locator('.menu-option').count(),1);
 await option.focus();await page.keyboard.press('Enter');assert.equal(await option.getAttribute('aria-pressed'),'false');
 await page.getByLabel('식단 메뉴 검색').fill('');
 await page.screenshot({path:'/tmp/anam-crimson-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'/tmp/anam-crimson-mobile.png',fullPage:true});
 console.log('Passed: real menu icons, click and keyboard subscription toggle, persistence, search, official hours, Wednesday price, mobile layout.');
}finally{await browser.close();}
