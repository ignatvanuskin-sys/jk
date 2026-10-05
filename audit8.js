(() => {
  // horizontal scroll test
  const startX = window.scrollX;
  window.scrollTo(200, window.scrollY);
  const afterX = window.scrollX;
  window.scrollTo(0, window.scrollY);
  // images
  const imgs = Array.from(document.querySelectorAll('img'));
  const broken = imgs.filter(i=>!(i.complete && i.naturalWidth>0)).map(i=>({src:(i.currentSrc||i.src).slice(0,90), nat:i.naturalWidth, loading:i.loading}));
  // copyright measurement
  const bar = Array.from(document.querySelectorAll('body > div')).find(e=>e.className && e.className.includes('z-[65]'));
  const barTop = bar ? Math.round(bar.getBoundingClientRect().top) : null;
  const links = Array.from(document.querySelectorAll('footer a, footer p, footer span')).filter(e=>/Политика конфиденциальности|Все права защищены|210340018927/i.test(e.textContent||''));
  const measured = links.map(e=>{const r=e.getBoundingClientRect();return {txt:(e.textContent||'').trim().slice(0,40), bottom:Math.round(r.bottom), top:Math.round(r.top)}}).sort((a,b)=>b.bottom-a.bottom);
  return {
    pageHorizontalScroll: {startX, afterX, canScrollX: afterX > 0},
    deScrollW: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, vw: window.innerWidth,
    images: {total: imgs.length, brokenCount: broken.length, broken},
    barTop, lastFooterText: measured[0]||null, clearance: (barTop && measured[0]) ? barTop-measured[0].bottom : null
  };
})()
