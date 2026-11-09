import {foodIcon} from '../../lib/preferences';
import {tasteProfile} from '../../lib/taste';
export default function FavoriteHero({keywords,categories,onConfigure}){
 const profile=tasteProfile(keywords,categories);
 return <section className="hero favorite-hero" aria-label="나의 식사 취향">
  <div className="favorite-copy">
   <span className="small-tag">나의 식사 취향</span>
   <h2>좋아하는 메뉴가 나오면<br/>놓치지 마세요.</h2>
   <p>키워드와 음식 종류를 저장하고 내 취향의 학식을 만나보세요.</p>
   {(keywords.length>0||categories.length>0)&&<div className="favorite-summary"><div className="favorite-summary-heading">내가 고른 메뉴 <span>{keywords.length}개</span></div>
    {keywords.length>0&&<ul className="favorite-tags" aria-label="등록한 관심 메뉴">{keywords.map(name=><li key={name}><span aria-hidden="true">{foodIcon(name)}</span> {name}</li>)}</ul>}
    {categories.length>0&&<div className="favorite-category-tags" aria-label="등록한 음식 종류">{categories.map(name=><span key={name}>#{name}</span>)}</div>}
   </div>}
   <button className="primary" onClick={onConfigure}>관심 메뉴 설정 <span>↗</span></button>
  </div>
  <div className="taste-card" aria-live="polite" aria-atomic="true">
   <span className="taste-caption">나의 학식 캐릭터</span>
   <div className={'taste-mascot animal-'+profile.animal} style={{'--fur':profile.color}} role="img" aria-label={profile.name+' 캐릭터'}>
    <span className="mascot-spark spark-left" aria-hidden="true">✧</span><span className="mascot-spark spark-right" aria-hidden="true">✦</span>
    <div className="mascot-ear ear-left"/><div className="mascot-ear ear-right"/>
    <div className="mascot-body"/><div className="mascot-face"><span className="mascot-stripes"/><span className="mascot-eye eye-left"/><span className="mascot-eye eye-right"/><span className="mascot-cheek cheek-left"/><span className="mascot-cheek cheek-right"/><span className="mascot-mouth">ω</span></div>
    <span className="mascot-snack" aria-hidden="true">{profile.icon}</span><span className="mascot-paw paw-left"/><span className="mascot-paw paw-right"/>
   </div>
   <strong className="taste-name">{profile.name}</strong><p className="taste-description">{profile.description}</p>
   <small>등록한 메뉴와 음식 종류로 보는 재미있는 별명</small>
  </div>
 </section>;
}
