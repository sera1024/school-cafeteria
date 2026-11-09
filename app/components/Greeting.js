'use client';
import {useEffect,useState} from 'react';
export default function Greeting(){
 const [name,setName]=useState('');
 const [draft,setDraft]=useState('');
 const [editing,setEditing]=useState(false);
 const [message,setMessage]=useState('');
 useEffect(()=>{try{const saved=localStorage.getItem('anam-name')||'';setName(saved.slice(0,20));setDraft(saved.slice(0,20));setEditing(!saved);}catch{setEditing(true);}},[]);
 function save(event){
  event.preventDefault();const value=draft.trim().replace(/\s+/g,' ').slice(0,20);
  if(!value){setMessage('이름을 입력해 주세요.');return;}
  setName(value);setDraft(value);setEditing(false);
  try{localStorage.setItem('anam-name',value);setMessage('이름을 저장했어요.');}catch{setMessage('이 브라우저에서는 이름을 저장할 수 없어 다시 접속하면 초기화됩니다.');}
 }
 function remove(){setName('');setDraft('');setEditing(true);try{localStorage.removeItem('anam-name');setMessage('이름을 삭제했어요.');}catch{setMessage('브라우저에 저장된 이름을 삭제하지 못했어요.');}}
 return <section className="intro">
  <div className="eyebrow">YOUR DAILY CAMPUS TABLE</div>
  <h1>{name&&<><span className="greeting-name">{name}</span> 님 </>}오늘은 어떤 <em>한 끼</em>인가요?</h1>
  <p>학식 확인부터 좋아하는 메뉴 알림까지, 나에게 맞는 식사를 찾아보세요.</p>
  <div className="name-settings">
   {editing?<form className="name-form" onSubmit={save}>
    <label htmlFor="display-name">이름 또는 별명</label>
    <div className="name-fields"><input id="display-name" name="nickname" autoComplete="nickname" maxLength={20} value={draft} onChange={e=>{setDraft(e.target.value);setMessage('');}} placeholder="어떻게 불러드릴까요?" aria-describedby="name-help"/><button className="primary" type="submit">이름 저장</button>{name&&<button type="button" className="link" onClick={()=>{setDraft(name);setEditing(false);setMessage('');}}>취소</button>}</div>
    <small id="name-help">최대 20자 · 이 브라우저에만 저장돼요.</small>
   </form>:<div className="name-actions"><button className="link" onClick={()=>{setDraft(name);setEditing(true);setMessage('');}}>이름 변경</button><span aria-hidden="true">·</span><button className="link" onClick={remove}>이름 삭제</button></div>}
   <span className="name-message" role="status">{message}</span>
  </div>
 </section>;
}
