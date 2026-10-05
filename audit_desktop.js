(() => {
  const de = document.documentElement;
  const cw = de.clientWidth;
  const hb = document.querySelector('button[aria-label="Открыть меню"]');
  const hbCs = hb ? getComputedStyle(hb) : null;
  const hbRect = hb ? hb.getBoundingClientRect() : null;
  // header nav
  const header = document.querySelector('header');
  const navLinks = header ? Array.from(header.querySelectorAll('nav a')).map(a=>a.innerText.trim()).filter(Boolean) : [];
  const headerButtons = header ? Array.from(header.querySelectorAll('button, a[aria-label]')).map(b=>{const cs=getComputedStyle(b);return {txt:(b.innerText||'').trim().slice(0,25)||b.getAttribute('aria-label'), display:cs.display}}) : [];
  // catalog
  const h2 = Array.from(document.querySelectorAll('h1,h2,h3')).find(e=>/Каталог квартир/i.test(e.textContent||''));
  let cat = null;
  if (h2) { const sec=h2.closest('section')||h2.parentElement;
    const arts=Array.from(sec.querySelectorAll('article'));
    cat={count:arts.length, types:Array.from(sec.querySelectorAll('h3,h4')).map(x=>x.textContent.trim()).filter(t=>/комнатная/i.test(t)),
      positions:arts.map(a=>{const r=a.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width)}})};
  }
  // bottom fixed bar visible?
  const bar = Array.from(document.querySelectorAll('body > div')).find(e=>e.className && e.className.includes('z-[65]'));
  const barCs = bar ? getComputedStyle(bar) : null;
  // logo
  const logo = header ? header.querySelector('a') : null;
  const logoRect = logo ? logo.getBoundingClientRect() : null;
  return {
    vw: window.innerWidth, cw, deScrollW: de.scrollWidth, overflow: de.scrollWidth - window.innerWidth,
    hamburger: hb ? {display: hbCs.display, visibility: hbCs.visibility, w: Math.round(hbRect.width), h: Math.round(hbRect.height), right: Math.round(hbRect.right)} : null,
    navLinksCount: navLinks.length, navLinks: navLinks.slice(0,15),
    headerButtons,
    catalog: cat,
    bottomBarDisplay: barCs ? barCs.display : null,
    logoRect: logoRect ? {x:Math.round(logoRect.x), w:Math.round(logoRect.width), h:Math.round(logoRect.height)} : null,
    bodyOverflowX: getComputedStyle(document.body).overflowX
  };
})()
