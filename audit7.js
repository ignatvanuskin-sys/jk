(() => {
  document.documentElement.style.scrollBehavior='auto';
  document.body.style.scrollBehavior='auto';
  window.scrollTo(0, document.documentElement.scrollHeight);
  const bar = Array.from(document.querySelectorAll('body > div')).find(e=>{const cs=getComputedStyle(e);return cs.position==='fixed' && cs.bottom==='0px' && e.getBoundingClientRect().height>30 && e.className.includes('z-[65]');});
  const barRect = bar ? bar.getBoundingClientRect() : null;
  const footer = document.querySelector('footer');
  const fr = footer ? footer.getBoundingClientRect() : null;
  // last non-fixed content in footer
  let last = null;
  if (footer) {
    const cs2 = Array.from(footer.querySelectorAll('*')).filter(e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>0&&r.height>0&&c.position!=='fixed';});
    cs2.sort((a,b)=>b.getBoundingClientRect().bottom-a.getBoundingClientRect().bottom);
    if(cs2[0]){const r=cs2[0].getBoundingClientRect();last={txt:(cs2[0].innerText||cs2[0].tagName).slice(0,40), bottom:Math.round(r.bottom)};}
  }
  return {
    scrollY: Math.round(window.scrollY),
    docHeight: document.documentElement.scrollHeight,
    atBottom: Math.abs(window.scrollY + window.innerHeight - document.documentElement.scrollHeight) < 3,
    barTop: barRect?Math.round(barRect.top):null,
    barH: barRect?Math.round(barRect.height):null,
    footerBottomInViewport: fr?Math.round(fr.bottom):null,
    footerTopInViewport: fr?Math.round(fr.top):null,
    lastFooterContent: last,
    gapLastContentToBar: (barRect&&last)?Math.round(barRect.top - last.bottom):null
  };
})()
