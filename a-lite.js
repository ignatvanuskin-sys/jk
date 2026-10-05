(() => {
  const W = window.innerWidth, H = window.innerHeight;
  const de = document.documentElement;
  const o = {vw:W, vh:H, sw:de.scrollWidth, cw:de.clientWidth, over:+(de.scrollWidth-de.clientWidth)};
  const gc = el => getComputedStyle(el);
  const sel = el => {
    let s = el.tagName.toLowerCase();
    if(el.id) return s+'#'+el.id;
    try{ if(el.className && typeof el.className==='string'){ const c=el.className.trim().split(/\s+/).filter(Boolean).slice(0,2).join('.'); if(c) s+='.'+c; } }catch(e){}
    return s;
  };
  const inScroller = el => {
    let p = el.parentElement;
    while(p && p!==document.body){
      const st = gc(p);
      const ox = st.overflowX;
      if((ox==='auto'||ox==='scroll') && p.scrollWidth>p.clientWidth+2) return sel(p);
      p=p.parentElement;
    }
    return null;
  };
  const culprits=[]; const seen=new Set();
  for(const el of document.querySelectorAll('body *')){
    const r = el.getBoundingClientRect();
    if(r.width>0 && r.height>0 && r.right>W+1){
      const s=sel(el); if(seen.has(s)) continue; seen.add(s);
      culprits.push({s, right:Math.round(r.right), w:Math.round(r.width), t:(el.textContent||'').trim().slice(0,25), sc: inScroller(el)});
      if(culprits.length>=60) break;
    }
  }
  o.culprits = culprits;
  const clipped=[];
  for(const el of document.querySelectorAll('p,span,h1,h2,h3,h4,li,div')){
    if(el.children.length>0) continue;
    if(el.scrollWidth>el.clientWidth+2 && el.clientWidth>0 && (el.textContent||'').trim().length>0){
      clipped.push({s:sel(el), scw:el.scrollWidth, cw:el.clientWidth, t:(el.textContent||'').trim().slice(0,30)});
      if(clipped.length>=25) break;
    }
  }
  o.clipped = clipped;
  const header = document.querySelector('header') || document.querySelector('[class*="header"]') || document.querySelector('nav');
  if(header){
    let max=null;
    for(const el of header.querySelectorAll('*')){
      const r=el.getBoundingClientRect();
      if(r.width>0&&r.height>0){ if(!max||r.right>max.right) max={s:sel(el), right:Math.round(r.right)}; }
    }
    const hr=header.getBoundingClientRect();
    o.header={s:sel(header), pos:gc(header).position, right:Math.round(hr.right), h:Math.round(hr.height), rightmost:max};
  } else o.header=null;
  o.fixed=[];
  for(const el of document.querySelectorAll('body *')){
    const st=gc(el);
    if(st.position==='fixed'){
      const r=el.getBoundingClientRect();
      if(r.width>0&&r.height>0){ o.fixed.push({s:sel(el), w:Math.round(r.width), h:Math.round(r.height), bottom:Math.round(H-r.bottom), top:Math.round(r.top)}); }
    }
  }
  const footer=document.querySelector('footer')||document.querySelector('[class*="footer"]');
  o.footer = footer ? {s:sel(footer), padBottom:gc(footer).paddingBottom, h:Math.round(footer.getBoundingClientRect().height)} : null;
  return o;
})()