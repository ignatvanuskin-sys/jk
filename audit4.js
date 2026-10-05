(() => {
  const cw = document.documentElement.clientWidth;
  const dialog = document.querySelector('[role="dialog"]');
  const openPanels = Array.from(document.querySelectorAll('[data-state="open"]')).length;
  const active = document.activeElement;
  const activeInfo = active ? {tag: active.tagName, aria: active.getAttribute('aria-label'), cls: (active.className||'').toString().slice(0,80)} : null;
  // header layout precise
  const header = document.querySelector('header');
  const hb = document.querySelector('button[aria-label="Открыть меню"]');
  const headerChildren = header ? Array.from(header.querySelectorAll('*')).filter(e=>{
    const r=e.getBoundingClientRect(); return r.width>0 && r.height>0 && (e.tagName==='BUTTON'||e.tagName==='A'||(e.tagName==='DIV'&&/flex/.test((e.className||'').toString())));
  }).slice(0,12).map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName, cls:(e.className||'').toString().slice(0,60), x:Math.round(r.x), right:Math.round(r.right), w:Math.round(r.width)}}) : [];
  return {
    cw,
    dialogStillPresent: !!dialog,
    dialogState: dialog ? dialog.getAttribute('data-state') : null,
    openPanels,
    activeInfo,
    hamburgerRect: hb ? (()=>{const r=hb.getBoundingClientRect();return {x:Math.round(r.x), w:Math.round(r.width), h:Math.round(r.height), right:Math.round(r.right)}})() : null,
    headerChildren,
    bodyOverflow: getComputedStyle(document.body).overflow
  };
})()
