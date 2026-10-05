(() => {
  const vw = window.innerWidth;
  const cw = document.documentElement.clientWidth;
  // Find widest elements causing overflow
  const all = Array.from(document.querySelectorAll('*'));
  let culprits = [];
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.right > cw + 1 || r.left < -1) {
      // check if inside an ancestor with overflow-x auto/scroll/hidden
      let p = el.parentElement, clipped = false;
      while (p) {
        const os = getComputedStyle(p);
        if (os.overflowX === 'auto' || os.overflowX === 'scroll' || os.overflowX === 'hidden') { clipped = true; break; }
        p = p.parentElement;
      }
      culprits.push({
        tag: el.tagName, cls: (el.className||'').toString().slice(0,70),
        left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
        clippedByAncestor: clipped,
        txt: (el.innerText||'').trim().slice(0,30)
      });
    }
  }
  culprits.sort((a,b)=>b.right-a.right);
  // hamburger button detail
  const hb = document.querySelector('button[aria-label="Открыть меню"]');
  let hbInfo = null;
  if (hb) {
    const r = hb.getBoundingClientRect();
    const cs = getComputedStyle(hb);
    hbInfo = {
      rect: {x:r.x, y:r.y, w:r.width, h:r.height, right:r.right},
      computed: {width: cs.width, height: cs.height, minWidth: cs.minWidth, flex: cs.flex, padding: cs.padding, boxSizing: cs.boxSizing},
      offsetW: hb.offsetWidth, offsetH: hb.offsetHeight,
      parentCls: (hb.parentElement.className||'').toString().slice(0,120),
      parentRect: (()=>{const pr=hb.parentElement.getBoundingClientRect();return {w:Math.round(pr.width), x:Math.round(pr.x)}})()
    };
  }
  // Logo in header
  const header = document.querySelector('header');
  const headerImgs = header ? Array.from(header.querySelectorAll('img')).map(i=>({src:i.currentSrc||i.src, nat:i.naturalWidth, rect:(()=>{const r=i.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}})()})) : [];
  const headerSvg = header ? header.querySelectorAll('svg').length : 0;
  return {
    vw, clientW: cw,
    topCulprits: culprits.slice(0, 15),
    culpritCount: culprits.length,
    hbInfo,
    headerImgs, headerSvg,
    headerTextFull: header ? header.innerText : null
  };
})()
