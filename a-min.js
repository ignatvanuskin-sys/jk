(()=>{
  if(!window.__sbh){ const st=document.createElement('style'); st.textContent='::-webkit-scrollbar{width:0!important;height:0!important}'; document.head.appendChild(st); window.__sbh=1; }
  const W=innerWidth,H=innerHeight,de=document.documentElement;
  const o={vw:W,sw:de.scrollWidth,cw:de.clientWidth,over:+(de.scrollWidth-de.clientWidth)};
  const gc=getComputedStyle;
  const sel=el=>{let s=el.tagName.toLowerCase();if(el.id)return s+'#'+el.id;try{if(el.className&&typeof el.className==='string'){const c=el.className.trim().split(/\s+/).filter(Boolean).slice(0,2).join('.');if(c)s+='.'+c;}}catch(e){}return s;};
  const isS=(e)=>e.className&&typeof e.className==='string'&&e.className.includes('sr-only');
  const inScroller=el=>{let p=el.parentElement;while(p&&p!==document.body){const st=gc(p);const ox=st.overflowX;if((ox==='auto'||ox==='scroll')&&p.scrollWidth>p.clientWidth+2)return sel(p);p=p.parentElement;}return null;};
  const cul=[];const seen=new Set();
  for(const el of document.querySelectorAll('body *')){ if(isS(el))continue; const r=el.getBoundingClientRect(); if(r.width>0&&r.height>0&&r.right>W+1){const s=sel(el);if(seen.has(s))continue;seen.add(s);cul.push(s+':'+Math.round(r.right)+(inScroller(el)?'(in-scroll)':'')); if(cul.length>=6)break;}}
  o.cul=cul;
  const cl=[];for(const el of document.querySelectorAll('p,span,h1,h2,h3,h4,li')){if(el.children.length||isS(el))continue;if(el.scrollWidth>el.clientWidth+2&&el.clientWidth>5&&el.textContent.trim()){cl.push(sel(el)+':'+el.scrollWidth+'/'+el.clientWidth);if(cl.length>=6)break;}}
  o.clip=cl;
  const hd=document.querySelector('header')||document.querySelector('[class*="header"]')||document.querySelector('nav');
  if(hd){let mx=0,mxs='';for(const el of hd.querySelectorAll('*')){const r=el.getBoundingClientRect();if(r.width>0&&r.height>0&&r.right>mx){mx=r.right;mxs=sel(el);}}o.hdr=Math.round(mx)+'|'+mxs;}
  o.fx=[...document.querySelectorAll('body *')].filter(e=>gc(e).position==='fixed'&&e.getBoundingClientRect().height>0).map(e=>{const r=e.getBoundingClientRect();return sel(e)+' h'+Math.round(r.height)+' top'+Math.round(r.top)+' bot'+Math.round(H-r.bottom);}).slice(0,6);
  const ft=document.querySelector('footer')||document.querySelector('[class*="footer"]');o.ft=ft?('h'+Math.round(ft.getBoundingClientRect().height)+' pb'+gc(ft).paddingBottom):null;
  return o;
})()