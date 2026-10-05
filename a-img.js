(async()=>{
  if(!window.__sbh){ const st=document.createElement('style'); st.textContent='::-webkit-scrollbar{width:0!important;height:0!important}'; document.head.appendChild(st); window.__sbh=1; }
  document.querySelectorAll('img').forEach(i=>{ try{i.loading='eager';}catch(e){} });
  const H=document.body.scrollHeight;
  for(let y=0;y<H;y+=500){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,140)); }
  window.scrollTo(0,0);
  await new Promise(r=>setTimeout(r,1500));
  const out=[];
  document.querySelectorAll('img').forEach(im=>{const r=im.getBoundingClientRect(); out.push({nw:im.naturalWidth,nh:im.naturalHeight,w:Math.round(r.width),h:Math.round(r.height),alt:(im.alt||'').slice(0,55),src:(im.currentSrc||im.src||'').split('/').pop().split('?')[0].slice(0,40),broken:im.naturalWidth===0,rn:im.naturalHeight?+(im.naturalWidth/im.naturalHeight).toFixed(2):null,rd:r.height?+(r.width/r.height).toFixed(2):null});});
  return {vw:innerWidth,count:out.length,docH:H,imgs:out};
})()