// Use the collected menu names, rather than a separate sample catalogue.
export function menuChoices(menus) {
 return [...new Set(menus.flatMap(m=>m.items.reduce((items,name)=>{if(/^&/.test(name.trim())&&items.length)items[items.length-1]+=' '+name;else items.push(name);return items;},[])).map(name=>name.replace(/^or\s+/i,'').replace(/^["“]+|["”]+$/g,'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ko'));
}
export function foodIcon(name) {
 const rules=[[/치킨|닭/,'🍗'],[/돈가스|돈까스|제육|불고기|삼겹|스테이크/,'🥩'],[/생선|참치|고등어|오징어/,'🐟'],[/파스타|국수|우동|라면/,'🍜'],[/찌개|국|탕|스프|전골/,'🍲'],[/밥/,'🍚'],[/샐러드|나물|김치|무침|채소/,'🥗'],[/계란|달걀/,'🍳'],[/두부/,'🫘'],[/튀김|감자/,'🍟'],[/차|음료/,'🫖']];
 return rules.find(([r])=>r.test(name))?.[1]||'🍽️';
}
export const mealHours={조식:'08:00–09:30',중식:'11:30–14:00',석식:'17:00–19:00'};
