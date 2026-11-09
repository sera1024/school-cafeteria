import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true});
try{
 const p=await browser.newPage();
 await p.route('**/api/menu*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({menus:[],fetchedAt:new Date().toISOString()})}));
 const base=process.env.APP_URL||'http://127.0.0.1:3004';
 await p.goto(base);
 await p.getByLabel('이름 또는 별명').fill('   ');await p.getByRole('button',{name:'이름 저장'}).click();await p.getByText('이름을 입력해 주세요.',{exact:true}).waitFor();
 await p.getByLabel('이름 또는 별명').fill('세라');await p.getByRole('button',{name:'이름 저장'}).click();
 await p.getByRole('heading',{name:'세라 님 오늘은 어떤 한 끼인가요?'}).waitFor();
 await p.reload();await p.getByRole('heading',{name:'세라 님 오늘은 어떤 한 끼인가요?'}).waitFor();
 await p.getByRole('button',{name:'이름 변경'}).click();await p.getByLabel('이름 또는 별명').fill('취소할이름');await p.getByRole('button',{name:'취소',exact:true}).click();assert.equal(await p.locator('.greeting-name').textContent(),'세라');
 await p.getByRole('button',{name:'이름 변경'}).click();await p.getByLabel('이름 또는 별명').fill('가'.repeat(20));await p.getByRole('button',{name:'이름 저장'}).click();
 await p.setViewportSize({width:390,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.getByRole('button',{name:'이름 삭제'}).click();await p.getByRole('heading',{name:'오늘은 어떤 한 끼인가요?',exact:true}).waitFor();
 await p.reload();await p.getByLabel('이름 또는 별명').waitFor();assert.equal(await p.getByLabel('이름 또는 별명').inputValue(),'');
 console.log('Passed: save, greeting, reload persistence, edit cancellation, long name on mobile, deletion and blank-name validation.');
}finally{await browser.close();}
