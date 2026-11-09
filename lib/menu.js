import * as cheerio from 'cheerio';
export const SOURCE = 'https://www.korea.ac.kr/ko/505/subview.do';
const meals = ['조식', '중식', '석식'];
const clean = s => s.replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim();
export function parseMenu(html, sourceUrl, now = new Date()) {
  const $ = cheerio.load(html); const result = [];
  $('script,style').remove();
  const split = cell => { const clone = $(cell).clone(); clone.find('br').replaceWith('\n'); clone.find('p,li,div').append('\n'); return clean(clone.text()).split(/\n+/).map(clean).filter(Boolean); };
  const dateOf = text => {
    const m = text.match(/(?:(20\d{2})[.\-/년\s]+)?(\d{1,2})[.\-/월]\s*(\d{1,2})/);
    if (!m) return null;
    let year = m[1] ? Number(m[1]) : Number(new Intl.DateTimeFormat('en',{timeZone:'Asia/Seoul',year:'numeric'}).format(now));
    const date = `${year}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;
    const parsed = new Date(date+'T00:00:00Z');
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === date ? date : null;
  };
  $('table').each((_,table)=>{
    const rows = $(table).find('tr').toArray(); let headers = []; let currentDate=null; const officialTable=$(table).text().includes('식단내용');
    for (const row of rows) {
      const cells = $(row).children('th,td').toArray(); const texts = cells.map(c=>split(c).join(' '));
      if(officialTable){const day=dateOf(texts[0]||'');if(day)currentDate=day;const idx=texts.findIndex(t=>meals.includes(t));if(currentDate&&idx>=0){const content=cells[idx+2];if(content)add(currentDate,texts[idx],split(content));}continue;}
      if (texts.filter(t=>dateOf(t)).length >= 2) { headers = texts.map(dateOf); continue; }
      const meal = texts.find(t=>meals.some(m=>t.includes(m)));
      if (meal && headers.some(Boolean)) {
        const kind = meals.find(m=>meal.includes(m));
        cells.forEach((cell,i)=>{ if(headers[i]) add(headers[i],kind,split(cell)); });
      } else {
        const date = dateOf(texts[0] || "");
        if(date && cells.length>=4) meals.forEach((m,i)=>add(date,m,split(cells[i+1])));
      }
    }
  });
  function add(date,meal,items) { const amount=items.join(' ').match(/[₩￦]\s*([\d,]+)/);const price=amount?Number(amount[1].replaceAll(',','')):null; items=items.filter(s=>!/^[-—\s]*$/.test(s) && !/^[₩￦]|등록된 식단내용/.test(s)); if(!items.length) return; const id=`${date}-${meal}`; if(!result.some(r=>r.id===id)) result.push({id,date,meal,items,price,sourceUrl}); }
  return result.sort((a,b)=>a.date.localeCompare(b.date)||meals.indexOf(a.meal)-meals.indexOf(b.meal));
}
export function discoverLinks(html, base) {
 const $=cheerio.load(html); return [...new Set($('a[href]').toArray().filter(a=>/식단|식당|급식|메뉴/.test($(a).text())).map(a=>{try { const u=new URL($(a).attr('href'),base);return ['https://dorm.korea.ac.kr','https://www.korea.ac.kr'].includes(u.origin) && !/\.(pdf|png|jpg|xlsx?)$/i.test(u.pathname) ? u.href : null;}catch{return null;}}).filter(Boolean))].slice(0,4);
}
