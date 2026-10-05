(() => {
  const cw = document.documentElement.clientWidth;
  // consult button in header
  const shell = document.querySelector('header .shell') || document.querySelector('header > div');
  const btns = shell ? Array.from(shell.querySelectorAll('button, a')).map(b => {
    const cs = getComputedStyle(b); const r = b.getBoundingClientRect();
    return {tag:b.tagName, txt:(b.innerText||'').trim().slice(0,30), aria:b.getAttribute('aria-label'),
      display:cs.display, visibility:cs.visibility,
      w:Math.round(r.width), h:Math.round(r.height), x:Math.round(r.x), right:Math.round(r.right)};
  }) : [];
  // catalog section
  const h = Array.from(document.querySelectorAll('h1,h2,h3')).find(e=>/Каталог квартир/i.test(e.textContent||''));
  let catalog = null;
  if (h) {
    let sec = h.closest('section') || h.parentElement;
    const arts = Array.from(sec.querySelectorAll('article'));
    const items = Array.from(sec.querySelectorAll('ul > li'));
    catalog = {
      sectionRect: (()=>{const r=sec.getBoundingClientRect();return {w:Math.round(r.width),x:Math.round(r.x)}})(),
      articleCount: arts.length,
      headingTypes: Array.from(sec.querySelectorAll('h3,h4')).map(x=>x.textContent.trim()).filter(t=>/комнатная/i.test(t)),
      liCount: items.length,
      firstRowPositions: arts.map(a=>{const r=a.getBoundingClientRect();return {x:Math.round(r.x),w:Math.round(r.width)}})
    };
  }
  // bottom fixed bar
  const fixedEls = Array.from(document.querySelectorAll('body *')).filter(e=>{
    const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
    return cs.position==='fixed' && r.bottom >= window.innerHeight-2 && r.height>30 && r.top > window.innerHeight/2;
  }).map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName, cls:(e.className||'').toString().slice(0,60), h:Math.round(r.height), y:Math.round(r.y), txt:(e.innerText||'').replace(/\n/g,' | ').slice(0,60)}});
  // footer bottom padding + last content
  const footer = document.querySelector('footer');
  const footerInfo = footer ? {
    paddingBottom: getComputedStyle(footer).paddingBottom,
    rect: (()=>{const r=footer.getBoundingClientRect();return {bottom:Math.round(r.bottom), height:Math.round(r.height)}})(),
    lastChildBottomInDoc: (()=>{const kids=footer.querySelectorAll('*');let max=0;kids.forEach(k=>{const r=k.getBoundingClientRect(); const b=r.bottom+window.scrollY; if(b>max)max=b;});return Math.round(max);})()
  } : null;
  return {
    cw, docHeight: document.documentElement.scrollHeight,
    headerButtons: btns,
    catalog,
    fixedBottom: fixedEls,
    bodyPaddingBottom: getComputedStyle(document.body).paddingBottom,
    mainPaddingBottom: document.querySelector('main') ? getComputedStyle(document.querySelector('main')).paddingBottom : null,
    footerInfo
  };
})()
