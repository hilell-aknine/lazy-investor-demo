/* ============================================================
   מנוע משותף: ניווט, פופאפים, toast, התקדמות (mock/localStorage)
   ============================================================ */
window.Portal = (function(){
  const store = {
    get(k,d){ try{ return JSON.parse(localStorage.getItem('lazy_'+k)) ?? d }catch(e){ return d } },
    set(k,v){ localStorage.setItem('lazy_'+k, JSON.stringify(v)) }
  };

  /* ---- toast ---- */
  function toast(msg){
    let t=document.createElement('div'); t.className='toast'; t.textContent=msg;
    document.body.appendChild(t); requestAnimationFrame(()=>t.classList.add('show'));
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),350) }, 2600);
  }

  /* ---- popup ---- */
  function popup({emoji='🦥',title,text,cta,ctaText='בוא נמשיך',onCta,onceKey}){
    if(onceKey && store.get('pop_'+onceKey)) return;
    const ov=document.createElement('div'); ov.className='pop-overlay';
    ov.innerHTML=`<div class="pop">
        <button class="x" aria-label="סגור">×</button>
        <div class="emoji">${emoji}</div>
        <h3>${title}</h3><p>${text}</p>
        <button class="btn btn-green">${ctaText}</button>
        <span class="later">אולי אחר כך</span>
      </div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(()=>ov.classList.add('show'));
    const close=()=>{ ov.classList.remove('show'); setTimeout(()=>ov.remove(),300); if(onceKey)store.set('pop_'+onceKey,true) };
    ov.querySelector('.x').onclick=close;
    ov.querySelector('.later').onclick=close;
    ov.querySelector('.btn').onclick=()=>{ close(); if(onCta)onCta(); if(cta)location.href=cta };
    ov.onclick=e=>{ if(e.target===ov)close() };
  }

  /* ---- theme (dark / light) ---- */
  const THEME_KEY='theme';
  function curTheme(){ return store.get(THEME_KEY,'light')==='dark' ? 'dark' : 'light'; }
  function applyTheme(t){ document.documentElement.setAttribute('data-theme', t); }
  function iconFor(){ return curTheme()==='dark' ? '☀️' : '🌙'; }
  function refreshIcons(){ document.querySelectorAll('.theme-toggle').forEach(b=>{ b.textContent=iconFor(); }); }
  function toggleTheme(){ const next = curTheme()==='dark' ? 'light' : 'dark'; store.set(THEME_KEY,next); applyTheme(next); refreshIcons(); }
  function makeBtn(){
    const b=document.createElement('button');
    b.type='button'; b.className='theme-toggle';
    b.setAttribute('aria-label','החלף מצב כהה או בהיר'); b.title='מצב כהה / בהיר';
    b.textContent=iconFor(); b.addEventListener('click',toggleTheme);
    return b;
  }
  function injectToggle(){
    if(document.querySelector('.theme-toggle')) return;
    const me=document.querySelector('.topbar .me');
    const b=makeBtn();
    if(me){ me.insertBefore(b, me.firstChild); }
    else { b.style.cssText+=';position:fixed;bottom:22px;left:22px;z-index:170;box-shadow:var(--shadow-lg);width:44px;height:44px;font-size:19px;border-radius:50%'; document.body.appendChild(b); }
  }
  applyTheme(curTheme());
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', injectToggle);
  else injectToggle();

  return { store, toast, popup, toggleTheme };
})();
