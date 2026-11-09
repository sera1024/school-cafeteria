export function estimate(items) {
 if(items.some(s=>/^or\b/i.test(s)))return {min:0,max:0,known:0,total:items.length,categories:[]};
 const rules=[[/감자튀김|양파링|춘권|사모사/,180,'튀김류'],[/돈까스|돈가스|치킨|튀김/,450,'튀김류'],[/불고기|제육|삼겹|갈비/,450,'육류'],[/생선|고등어|삼치/,300,'생선'],[/비빔밥|덮밥|볶음밥/,600,'밥류'],[/국수|우동|라면|파스타/,550,'면류'],[/밥/,300,'밥류'],[/찌개|탕/,180,'국·찌개'],[/국/,80,'국·찌개'],[/두부|계란|달걀/,120,'단백질'],[/김치|나물|샐러드|무침/,40,'채소']];
 let total=0,known=0;const categories=new Set();for(const item of items){const rule=rules.find(([r])=>r.test(item)); if(rule){known++;total+=rule[1];categories.add(rule[2]);}}
 return {min:Math.round(total*.8),max:Math.round(total*1.2),known,total:items.length,categories:[...categories]};
}
export function matches(menu, keywords, categories) {const e=estimate(menu.items);return keywords.some(k=>menu.items.some(i=>i.toLowerCase().includes(k.toLowerCase())))||categories.some(c=>e.categories.includes(c));}
