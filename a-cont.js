(()=>{
  if(!window.__sbh){ const st=document.createElement('style'); st.textContent='::-webkit-scrollbar{width:0!important;height:0!important}'; document.head.appendChild(st); window.__sbh=1; }
  const W=innerWidth, gc=getComputedStyle;
  const parse=c=>{const m=c&&c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(Number);return{r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1};};
  const lum=c=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b);};
  const bgOf=el=>{let p=el;while(p){const c=parse(gc(p).backgroundColor);if(c&&c.a>0.5)return c;p=p.parentElement;}return{r:255,g:255,b:255,a:1};};
  const out=new Map();
  for(const el of document.querySelectorAll('p,span,a,li,h1,h2,h3,h4,button,div,label,strong,em,b,small,dt,dd')){
    if(el.children.length>0)continue;
    const t=(el.textContent||'').trim(); if(t.length<2)continue;
    if(el.className&&typeof el.className==='string'&&el.className.includes('sr-only'))continue;
    const st=gc(el); const fg=parse(st.color); if(!fg)continue;
    const bg=bgOf(el); const fs=parseFloat(st.fontSize); const fw=parseInt(st.fontWeight)||400;
    const L1=lum(fg),L2=lum(bg); const ratio=+(((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05))).toFixed(2);
    const large=fs>=24||(fs>=18.66&&fw>=700);
    const key=`${Math.round(fg.r)},${Math.round(fg.g)},${Math.round(fg.b)}|${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)}|${fs}`;
    if(!out.has(key)) out.set(key,{fg:`rgb(${Math.round(fg.r)},${Math.round(fg.g)},${Math.round(fg.b)})`,bg:`rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`,fs,fw,ratio,large,fail:large?ratio<3:ratio<4.5,t:t.slice(0,26)});
  }
  return {vw:W, n:out.size, items:[...out.values()].sort((a,b)=>a.ratio-b.ratio)};
})()