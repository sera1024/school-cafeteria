import { fetch as request, EnvHttpProxyAgent } from 'undici';
import * as cheerio from 'cheerio';
import { weekStart } from './week.js';
import { SOURCE, parseMenu, discoverLinks } from './menu.js';
const allowed=new Set(['https://dorm.korea.ac.kr','https://www.korea.ac.kr']);
const dispatcher=process.env.HTTPS_PROXY||process.env.HTTP_PROXY?new EnvHttpProxyAgent():undefined;
const cache=new Map();const pending=new Map();
async function get(url){
 if(!allowed.has(new URL(url).origin))throw Error('허용된 공식 사이트만 수집합니다.');
 const r=await request(url,{dispatcher,signal:AbortSignal.timeout(12000),headers:{'User-Agent':'AnamTable/1.0 (student cafeteria reader)','accept-language':'ko-KR','accept-encoding':'identity'},redirect:'manual'});
 if(!r.ok)throw Error(`공식 사이트 응답 오류 (${r.status})`);return r.text();
}
export async function crawl(date){
 const week=date?weekStart(date):'';
 const key=week||'current';const saved=cache.get(key);
 if(saved&&Date.now()-saved.at<1800000)return saved.value;
 if(pending.has(key))return pending.get(key);
 const job=run(week).then(value=>{if(cache.size>=24)cache.delete(cache.keys().next().value);cache.set(key,{at:Date.now(),value});return value;}).finally(()=>pending.delete(key));pending.set(key,job);return job;
}
async function run(week){
 let start=process.env.MENU_SOURCE_URL||SOURCE;
 if(week){const target=new URL('https://www.korea.ac.kr/diet/ko/10/view.do');target.searchParams.set('monday',week.replaceAll('-','.'));target.searchParams.set('week','');start=target.href;}
 const u=new URL(start);if(!allowed.has(u.origin))throw Error('공식 학교 도메인만 수집할 수 있습니다.');
 const robots=await request(new URL('/robots.txt',u),{dispatcher,signal:AbortSignal.timeout(8000),redirect:'manual'});
 const disallowed=[];
 if(robots.ok){let applies=false;for(const line of (await robots.text()).split('\n')){const [key,...parts]=line.split(':');const val=parts.join(':').split('#')[0].trim();if(key.trim().toLowerCase()==='user-agent')applies=val==='*'||val.toLowerCase().includes('anamtable');if(applies&&key.trim().toLowerCase()==='disallow'&&val)disallowed.push(val);}}
 // The dorm server sends missing files, including robots.txt, to this known 404 page.
 else if(robots.status!==404&&!(robots.status===302&&robots.headers.get('location')==='http://errdoc.gabia.io/404.html'))throw Error('robots.txt 확인에 실패했습니다.');
 const queue=[start];const visited=new Set();let menus=[],images=[],period=null;
 while(queue.length&&visited.size<5){const url=queue.shift();if(visited.has(url))continue;visited.add(url);if(disallowed.some(p=>new URL(url).pathname.startsWith(p)))continue;if(visited.size>1)await new Promise(r=>setTimeout(r,1000));const html=await get(url);const $=cheerio.load(html);const range=$('.dateTxt').text().match(/(\d{4})\.(\d{2})\.(\d{2})\.\s*~\s*(\d{4})\.(\d{2})\.(\d{2})/);if(range)period={start:range.slice(1,4).join('-'),end:range.slice(4,7).join('-')};menus.push(...parseMenu(html,url));
 if(/\/front\/board\/7\/post\/\d+/.test(new URL(url).pathname)){
 const title=$('h1,h2,h3,h4,.subject,.title').map((_,e)=>$(e).text().trim()).get().find(t=>/주간메뉴|식단/.test(t))||'안암학사 주간 식단';
 images=$('img[src*="/front/attach/preview/"]').map((_,e)=>({url:new URL($(e).attr('src'),url).href,sourceUrl:url,title})).get();
 }
 if(menus.length||images.length||period)break;
 queue.push(...discoverLinks(html,url).filter(l=>!visited.has(l)));
 }
 if(!menus.length&&!images.length&&!period)throw Error('공식 페이지에서 식단을 찾지 못했습니다. 식단 URL이나 사이트 구조를 확인해 주세요.');
 return {menus,images,period,fetchedAt:new Date().toISOString(),source:u.origin};
}
