(() => {
  const cw = document.documentElement.clientWidth;
  // max horizontal scroll
  window.scrollTo(99999, window.scrollY);
  const maxScrollX = window.scrollX;
  window.scrollTo(0, window.scrollY);
  // inspect scroll-x element
  const sx = document.querySelector('.scroll-x');
  let chain = [];
  if (sx) {
    let el = sx;
    while (el && el !== document.documentElement.parentElement) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      chain.push({tag: el.tagName, cls:(el.className||'').toString().slice(0,60), overflowX: cs.overflowX, w: Math.round(r.width), right: Math.round(r.right)});
      el = el.parentElement;
      if (chain.length > 8) break;
    }
  }
  // find widest element NOT clipped by an overflow-x auto/scroll ancestor (true page-level overflow)
  const offenders = [];
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.right > cw + 1) {
      let p = el.parentElement, internallyScrollable = false;
      while (p && p !== document.documentElement) {
        const os = getComputedStyle(p).overflowX;
        if (os === 'auto' || os === 'scroll') { internallyScrollable = true; break; }
        p = p.parentElement;
      }
      if (!internallyScrollable) offenders.push({tag: el.tagName, cls:(el.className||'').toString().slice(0,60), right: Math.round(r.right), w: Math.round(r.width)});
    }
  }
  offenders.sort((a,b)=>b.right-a.right);
  return { cw, maxScrollX, scrollXChain: chain, trueOffenders: offenders.slice(0,12), offenderCount: offenders.length };
})()
