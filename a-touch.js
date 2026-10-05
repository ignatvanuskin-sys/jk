(()=>{
  if(!window.__sbh){ const st=document.createElement('style'); st.textContent='::-webkit-scrollbar{width:0!important;height:0!important}'; document.head.appendChild(st); window.__sbh=1; }
  const W=innerWidth, gc=getComputedStyle;
  const sel=el=>{let s=el.tagName.toLowerCase();if(el.id)return s+'#'+el.id;try{if(el.className&&typeof el.className==='string'){const c=el.className.trim().split(/\s+/).filter(Boolean).slice(0,2).join('.');if(c)s+='.'+c;}}catch(e){}return s;};
  const seen=new Map();
  for(const el of document.querySelectorAll('a,button,[role="button"],input[type="submit"],select')){
    const r=el.getBoundingClientRect(); if(r.width===0&&r.height===0)continue;
    const w=Math.round(r.width),h=Math.round(r.height); if(w>=44&&h>=44)continue;
    const k=sel(el)+'|'+((el.textContent||'').trim().slice(0,16));
    if(!seen.has(k)) seen.set(k,{s:sel(el),t:(el.textContent||'').trim().slice(0,20),w,h,inline:gc(el).display==='inline'});
  }
  return {vw:W, n:seen.size, items:[...seen.values()]};
})()