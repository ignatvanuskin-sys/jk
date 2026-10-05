(() => {
  const de = document.documentElement;
  const body = document.body;
  const txt = body.innerText || '';
  const demoWords = ['Демо-данные','Демо данные','Демонстрационная версия','демонстрационный','демонстрационная','демо'];
  const demoFound = demoWords.filter(w => txt.toLowerCase().includes(w.toLowerCase()));
  const imgs = Array.from(document.querySelectorAll('img'));
  const broken = imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => ({src: i.currentSrc || i.src, nat: i.naturalWidth}));
  const total = imgs.length;
  const loaded = imgs.filter(i => i.complete && i.naturalWidth > 0).length;
  // header
  const header = document.querySelector('header');
  const headerInfo = header ? {
    rect: header.getBoundingClientRect().toJSON(),
    text: header.innerText.slice(0, 300),
    bg: getComputedStyle(header).backgroundColor,
    position: getComputedStyle(header).position
  } : null;
  // find buttons with aria-label or hamburger-ish
  const btns = Array.from(document.querySelectorAll('button, a[role=button], [role=button]')).map(b => ({
    tag: b.tagName,
    aria: b.getAttribute('aria-label'),
    txt: (b.innerText||'').trim().slice(0,40),
    cls: (b.className||'').toString().slice(0,80),
    rect: (()=>{const r=b.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),x:Math.round(r.x),y:Math.round(r.y)}})()
  })).filter(b => /menu|меню|hamburger|burger/i.test((b.aria||'')+(b.cls||'')) || (b.rect.w<=80 && b.rect.w>=30));
  return {
    url: location.href,
    vw: window.innerWidth, vh: window.innerHeight,
    deScrollW: de.scrollWidth, deClientW: de.clientWidth,
    bodyScrollW: body.scrollWidth,
    bodyOverflowX: getComputedStyle(body).overflowX,
    htmlOverflowX: getComputedStyle(de).overflowX,
    hOverflow: de.scrollWidth - window.innerWidth,
    demoFound,
    imgs: {total, loaded, broken},
    headerInfo,
    candidateButtons: btns,
    bodyTextLen: txt.length
  };
})()
