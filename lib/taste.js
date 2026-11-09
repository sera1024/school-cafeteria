const profiles = [
 {id:'meat',name:'고기파 호랑이',icon:'🥩',animal:'tiger',color:'#f5bd77',description:'고기 반찬에 먼저 눈이 가는 편',rule:/제육|불고기|삼겹|갈비|스테이크|함박|돈육|돼지|소고기|닭갈비/,category:'육류'},
 {id:'crispy',name:'바삭바삭 고양이',icon:'🍗',animal:'cat',color:'#f2ce8b',description:'바삭한 한 입을 좋아하는 편',rule:/돈가스|돈까스|치킨|튀김|텐더|생선가스|양파링|춘권/,category:'튀김류'},
 {id:'noodle',name:'면치기 여우',icon:'🍜',animal:'fox',color:'#efaa88',description:'면 메뉴가 나오면 그냥 못 지나치는 편',rule:/파스타|국수|우동|라면|쌀국수|냉면|짜장|짬뽕|스파게티/,category:'면류'},
 {id:'soup',name:'국물 곰돌이',icon:'🍲',animal:'bear',color:'#d7b59b',description:'따뜻한 국물 한 숟갈이 좋은 편',rule:/찌개|장국|미역국|전골|짜글이|스프|국밥|설렁탕|곰탕|육개장|국$|탕$/,category:'국·찌개'},
 {id:'rice',name:'밥심 햄찌',icon:'🍚',animal:'hamster',color:'#eed1ae',description:'든든한 밥 한 그릇을 좋아하는 편',rule:/밥|덮밥|리소토|리조또|카레라이스/,category:'밥류'},
 {id:'veggie',name:'초록 토끼',icon:'🥬',animal:'rabbit',color:'#c3d8a9',description:'채소 반찬도 빼놓지 않는 편',rule:/샐러드|나물|김치|무침|채소|시금치|브로콜리|깍두기|단무지/,category:'채소'},
 {id:'sea',name:'바다 수달',icon:'🐟',animal:'otter',color:'#b7d7e1',description:'생선과 해산물 반찬을 좋아하는 편',rule:/생선|참치|고등어|삼치|오징어|새우|해물|연어|조개|멸치/,category:'생선'},
 {id:'protein',name:'든든 병아리',icon:'🍳',animal:'chick',color:'#f4dd85',description:'달걀과 두부 반찬을 좋아하는 편',rule:/계란|달걀|두부|오믈렛/,category:'단백질'},
];
const mixed={id:'mixed',name:'골고루 햄찌',icon:'🍱',animal:'hamster',color:'#e9bfd2',description:'한 가지로 고르기 어려운 다양한 입맛'};
const explorer={id:'explorer',name:'입맛 탐험가',icon:'🍽️',animal:'tiger',color:'#f1cf9b',description:'좋아하는 메뉴를 하나씩 찾아가는 중'};
export function tasteProfile(keywords=[],categories=[]){
 const scores=new Map(profiles.map(p=>[p.id,0]));
 // One vote per menu: a meat rice bowl is classified by its main ingredient first.
 for(const name of new Set(keywords.map(k=>k.trim()).filter(Boolean))){const p=profiles.find(p=>p.rule.test(name));if(p)scores.set(p.id,scores.get(p.id)+1);}
 for(const category of new Set(categories)){const p=profiles.find(p=>p.category===category);if(p)scores.set(p.id,scores.get(p.id)+1);}
 const max=Math.max(...scores.values());if(!max)return explorer;
 const winners=profiles.filter(p=>scores.get(p.id)===max);return winners.length===1?winners[0]:mixed;
}
export const tasteProfiles=[...profiles,mixed,explorer];
