(() => {
  const cw = document.documentElement.clientWidth;
  // find dialog / sheet panel
  const dialogs = Array.from(document.querySelectorAll('[role="dialog"], [data-state="open"]'));
  const panelInfo = dialogs.map(d => {
    const r = d.getBoundingClientRect();
    const cs = getComputedStyle(d);
    return {
      tag: d.tagName,
      role: d.getAttribute('role'),
      ariaModal: d.getAttribute('aria-modal'),
      dataState: d.getAttribute('data-state'),
      cls: (d.className||'').toString().slice(0,120),
      rect: {x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height), right:Math.round(r.right)},
      position: cs.position,
      side: (r.x + r.width >= cw - 2) ? 'RIGHT' : (r.x <= 2 ? 'LEFT' : 'other'),
      overflowY: cs.overflowY,
      transforms: cs.transform,
      links: Array.from(d.querySelectorAll('a')).map(a=>(a.innerText||'').trim()).filter(Boolean).slice(0,30),
      buttons: Array.from(d.querySelectorAll('button')).map(b=>({t:(b.innerText||'').trim().slice(0,40), aria:b.getAttribute('aria-label')})),
      textHead: (d.innerText||'').slice(0,400)
    };
  });
  // scroll lock check
  const bodyCS = getComputedStyle(document.body);
  const htmlCS = getComputedStyle(document.documentElement);
  const scrollLock = {
    bodyOverflow: bodyCS.overflow,
    bodyOverflowY: bodyCS.overflowY,
    bodyPosition: bodyCS.position,
    htmlOverflowY: htmlCS.overflowY,
    bodyAttr: document.body.getAttribute('data-scroll-locked') || document.body.style.overflow || null,
    bodyPadRight: bodyCS.paddingRight
  };
  // try scroll
  const before = window.scrollY;
  window.scrollTo(0, before + 300);
  const after = window.scrollY;
  return {
    cw,
    panelCount: panelInfo.length,
    panelInfo,
    scrollLock,
    scrollTest: {before, after, locked: before === after}
  };
})()
