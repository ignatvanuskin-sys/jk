(() => {
  // hide desktop scrollbar so clientWidth == innerWidth (mobile-like)
  if(!window.__sbh){ const st=document.createElement('style'); st.textContent='::-webkit-scrollbar{width:0!important;height:0!important}'; document.head.appendChild(st); window.__sbh=1; }
  const W=innerWidth,H=innerHeight,de=document.documentElement;
  const o={vw:W,vh:H,sw:de.scrollWidth,cw:de.clientWidth,over:+(de.scrollWidth-de.clientWidth)};
  const gc=el=>getComputedStyle(el);
  const sel=el=>{let s=el.tagName.toLowerCase();if(el.id)return s+'#'+el.id;try{if(el.className&&typeof el.className==='string'){const c=el.className.trim().split(/\s+/).filter(Boolean).slice(0,2).join('.');if(c)s+='.'+c;}}catch(e){}return s;};
  const sronly=el=>{try{return typeof el.className==='string'&&el.className.includes('sr-only');}catch(e){return false;}};
  const inScroller=el=>{let p=el.parentElement;while(p&&p!==document.body){const st=gc(p);const ox=st.overflowX;if((ox==='auto'||ox==='scroll')&&p.scrollWidth>p.clientWidth+2)return sel(p);p=p.parentElement;}return null;};
  const culprits=[];const seen=new Set();
  for(const el of document.querySelectorAll('body *')){
    if(sronly(el))continue;
    const r=el.getBoundingClientRect();
    if(r.width>0&&r.height>0&&r.right>W+1){
      const s=sel(el);if(seen.has(s))continue;seen.add(s);
      culprits.push({s,right:Math.round(r.right),w:Math.round(r.width),t:(el.textContent||'').trim().slice(0,22),sc:inScroller(el)});
      if(culprits.length>=25)break;
    }
  }
  o.culprits=culprits;
  const clipped=[];
  for(const el of document.querySelectorAll('p,span,h1,h2,h3,h4,li')){
    if(el.children.length>0||sronly(el))continue;
    if(el.scrollWidth>el.clientWidth+2&&el.clientWidth>5&&(el.textContent||'').trim().length>0){
      clipped.push({s:sel(el),scw:el.scrollWidth,cw:el.clientWidth,t:(el.textContent||'').trim().slice(0,28)});
      if(clipped.length>=15)break;
    }
  }
  o.clipped=clipped;
  const header=document.querySelector('header')||document.querySelector('[class*="header"]')||document.querySelector('nav');
  if(header){let max=null;for(const el of header.querySelectorAll('*')){const r=el.getBoundingClientRect();if(r.width>0&&r.height>0){if(!max||r.right>max.right)max={s:sel(el),right:Math.round(r.right)};}}const hr=header.getBoundingClientRect();o.header={s:sel(header),pos:gc(header).position,right:Math.round(hr.right),h:Math.round(hr.height),rightmost:max};}else o.header=null;
  o.fixed=[];for(const el of document.querySelectorAll('body *')){const st=gc(el);if(st.position==='fixed'){const r=el.getBoundingClientRect();if(r.width>0&&r.height>0)o.fixed.push({s:sel(el),w:Math.round(r.width),h:Math.round(r.height),bottom:Math.round(H-r.bottom),top:Math.round(r.top)});}}
  const footer=document.querySelector('footer')||document.querySelector('[class*="footer"]');
  o.footer=footer?{s:sel(footer),padBottom:gc(footer).paddingBottom,h:Math.round(footer.getBoundingClientRect().height)}:null;
  o.images=[];
  for(const im of document.querySelectorAll('img')){const r=im.getBoundingClientRect();const nw=im.naturalWidth,nh=im.naturalHeight;o.images.push({src:(im.currentSrc||im.src||'').split('/').pop().split('?')[0].slice(0,44),nw,nh,w:Math.round(r.width),h:Math.round(r.height),alt:(im.alt||'').slice(0,38),broken:nw===0,ratioNat:nh?+(nw/nh).toFixed(2):null,ratioDisp:r.height?+(r.width/r.height).toFixed(2):null});}
  o.touch=[];
  for(const el of document.querySelectorAll('a,button,[role="button"],input[type="submit"],select')){const r=el.getBoundingClientRect();if(r.width===0&&r.height===0)continue;const w=Math.round(r.width),h=Math.round(r.height);if(w<44||h<44){const st=gc(el);o.touch.push({tag:el.tagName.toLowerCase(),s:sel(el),t:(el.textContent||'').trim().slice(0,22),w,h,inline:st.display==='inline',href:(el.getAttribute('href')||'').slice(0,28)});}}
  o.touchCount=o.touch.length;
  const parse=c=>{const m=c&&c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(Number);return{r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1};};
  const lum=c=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b);};
  const bgOf=el=>{let p=el;while(p){const c=parse(gc(p).backgroundColor);if(c&&c.a>0.5)return c;p=p.parentElement;}return{r:255,g:255,b:255,a:1};};
  const ct=el=>{const st=gc(el);const fg=parse(st.color);if(!fg)return null;const bg=bgOf(el);const L1=lum(fg),L2=lum(bg);const ratio=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);const fs=parseFloat(st.fontSize);const fw=parseInt(st.fontWeight)||400;return{color:`rgb(${Math.round(fg.r)},${Math.round(fg.g)},${Math.round(fg.b)})`,bg:`rgb(${bg.r},${bg.g},${bg.b})`,ratio:+ratio.toFixed(2),fs,fw,large:fs>=24||(fs>=18.66&&fw>=700)};};
  o.contrast=[];
  const push=(label,el)=>{if(el){const c=ct(el);if(c)o.contrast.push(Object.assign({label,s:sel(el),text:(el.textContent||'').trim().slice(0,26)},c));}};
  const ps=[...document.querySelectorAll('p')].filter(e=>e.children.length===0&&e.textContent.trim().length>10);
  push('paragraph-light',ps.find(e=>lum(bgOf(e))>0.5));
  push('paragraph-dark',ps.find(e=>lum(bgOf(e))<=0.5));
  const eyebrow=[...document.querySelectorAll('*')].find(e=>{const ff=(e.className&&typeof e.className==='string'?e.className:'').toLowerCase();return (ff.includes('eyebrow')||ff.includes('kicker'))&&e.children.length===0&&e.textContent.trim().length>1;});
  push('eyebrow',eyebrow);
  const card=[...document.querySelectorAll('[class*="card"] *, [class*="Card"] *')].find(e=>e.children.length===0&&e.textContent.trim().length>3);
  push('card-text',card);
  const ft=footer?[...footer.querySelectorAll('p,span,a,li')].find(e=>e.children.length===0&&e.textContent.trim().length>2):null;
  push('footer-text',ft);
  const fixedEls=[...document.querySelectorAll('body *')].filter(e=>gc(e).position==='fixed'&&e.getBoundingClientRect().height>0);
  const bb=fixedEls.length?[...fixedEls[fixedEls.length-1].querySelectorAll('a,span,button,div')].find(e=>e.children.length===0&&e.textContent.trim().length>1):null;
  push('bottom-bar-text',bb);
  return o;
})()