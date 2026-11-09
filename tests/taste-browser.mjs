import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true});
try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 const base=process.env.APP_URL||'http://127.0.0.1:3003';
 await p.route('**/api/menu*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({menus:[{date:'2026-11-09',meal:'중식',id:'sample',items:['제육볶음','우동','쌀밥']}],fetchedAt:new Date().toISOString()})}));
 await p.goto(base);await p.getByText('입맛 탐험가',{exact:true}).waitFor();
 await p.getByRole('button',{name:'관심 메뉴 설정 ↗'}).click();
 await p.getByRole('button',{name:'제육볶음 알림 설정',exact:true}).click();
 await p.getByText('고기파 호랑이',{exact:true}).waitFor();
 assert.ok((await p.locator('.favorite-tags').innerText()).includes('제육볶음'));
 await p.getByRole('button',{name:'우동 알림 설정',exact:true}).click();
 await p.getByText('골고루 햄찌',{exact:true}).waitFor();
 await p.getByRole('button',{name:'우동 알림 설정',exact:true}).click();
 await p.getByText('고기파 호랑이',{exact:true}).waitFor();
 await p.reload();await p.getByText('고기파 호랑이',{exact:true}).waitFor();
 await p.locator('.favorite-hero').screenshot({path:'/tmp/anam-taste-desktop.png'});
 await p.setViewportSize({width:390,height:844});
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.locator('.favorite-hero').screenshot({path:'/tmp/anam-taste-mobile.png'});
 await p.getByRole('button',{name:'관심 메뉴 설정 ↗'}).click();
 await p.getByRole('button',{name:'제육볶음 ×',exact:true}).click();await p.getByText('입맛 탐험가',{exact:true}).waitFor();
 await p.getByRole('button',{name:'채소 +',exact:true}).click();await p.getByText('초록 토끼',{exact:true}).waitFor();
 assert.ok((await p.locator('.favorite-category-tags').innerText()).includes('채소'));
 // Long labels and all 20 saved preferences must remain contained on narrow screens.
 await p.evaluate(()=>localStorage.setItem('anam-prefs',JSON.stringify({keys:Array.from({length:20},(_,i)=>'아주긴이름의관심메뉴'.repeat(4)+i),cats:[]})));
 await p.reload();await p.locator('.favorite-tags li').last().waitFor();
 assert.equal(await p.locator('.favorite-tags li').count(),20);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 console.log('Passed: menu summary, dynamic/tied/empty/category personas, persistence, hero navigation, 20 long preferences, mobile.');
}finally{await b.close();}
