(() => {
  window.scrollTo(0, document.documentElement.scrollHeight);
  const bar = Array.from(document.querySelectorAll('body *')).find(e=>{
    const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
    return cs.position==='fixed' && r.bottom>=window.innerHeight-2 && r.height>30 && r.top>window.innerHeight/2;
  });
  const barRect = bar ? bar.getBoundingClientRect() : null;
  const barInfo = bar ? {h:Math.round(barRect.height), top:Math.round(barRect.top), cls:(bar.className||'').toString().slice(0,80),
    txt:(bar.innerText||'').replace(/\n/g,' | ').slice(0,80)} : null;
  // footer last visible content
  const footer = document.querySelector('footer');
  let lastContent = null;
  if (footer) {
    const cands = Array.from(footer.querySelectorAll('h1,h2,h3,p,a,li,span,img,svg,div')).filter(e=>{
      const r=e.getBoundingClientRect(); const cs=getComputedStyle(e);
      return r.width>0 && r.height>0 && cs.position!=='fixed' && cs.visibility!=='hidden' && r.bottom<=window.innerHeight+5;
    });
    cands.sort((a,b)=>b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom);
    if (cands[0]) { const r=cands[0].getBoundingClientRect(); lastContent = {txt:(cands[0].innerText||cands[0].tagName||'').slice(0,50), bottom:Math.round(r.bottom), tag:cands[0].tagName}; }
  }
  // Is there any spacer after footer?
  const footerNext = footer ? footer.nextElementSibling : null;
  const spacerInfo = footerNext ? {tag:footerNext.tagName, cls:(footerNext.className||'').toString().slice(0,80), h:Math.round(footerNext.getBoundingClientRect().height)} : null;
  // body direct children heights near end
  const bodyKids = Array.from(document.body.children).map(c=>({tag:c.tagName, cls:(c.className||'').toString().slice(0,50)}));
  return {
    scrollY: Math.round(window.scrollY),
    docHeight: document.documentElement.scrollHeight,
    barInfo,
    lastFooterContent: lastContent,
    gapBetweenContentAndBar: (barRect && lastContent) ? Math.round(barRect.top - lastContent.bottom) : null,
    spacerInfo,
    bodyChildren: bodyKids,
    bodyPaddingBottom: getComputedStyle(document.body).paddingBottom,
    footerPaddingBottom: footer ? getComputedStyle(footer).paddingBottom : null
  };
})()
