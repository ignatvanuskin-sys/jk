(() => {
  const header = document.querySelector('header[data-site-header="true"]') || document.querySelector('header');
  const out = {};
  out.innerWidth = window.innerWidth;
  out.innerHeight = window.innerHeight;
  out.devicePixelRatio = window.devicePixelRatio;
  out.docClientWidth = document.documentElement.clientWidth;
  out.docScrollWidth = document.documentElement.scrollWidth;
  out.bodyScrollWidth = document.body.scrollWidth;
  out.bodyOverflowX = getComputedStyle(document.body).overflowX;
  out.htmlOverflowX = getComputedStyle(document.documentElement).overflowX;

  // PHONE
  const phone = header.querySelector('a[href^="tel:"]');
  if (phone) {
    const r = phone.getBoundingClientRect();
    const cs = getComputedStyle(phone);
    let boxes = null;
    try {
      const range = document.createRange();
      range.selectNodeContents(phone);
      const rects = Array.from(range.getClientRects());
      boxes = rects.map(x => ({x:+x.x.toFixed(2), y:+x.y.toFixed(2), w:+x.width.toFixed(2), h:+x.height.toFixed(2)}));
    } catch(e) { boxes = 'ERR:'+e.message; }
    out.phone = {
      text: phone.textContent.trim(),
      href: phone.getAttribute('href'),
      rect: {top:+r.top.toFixed(2), left:+r.left.toFixed(2), right:+r.right.toFixed(2), h:+r.height.toFixed(2), w:+r.width.toFixed(2)},
      display: cs.display,
      whiteSpace: cs.whiteSpace,
      rectsCount: Array.isArray(boxes) ? boxes.length : boxes,
      rects: boxes
    };
  } else out.phone = null;

  // RIGHTMOST header element (visible)
  let maxRight = -1e9, maxEl = null;
  header.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (r.right > maxRight) { maxRight = r.right; maxEl = el; }
  });
  out.rightmostVisible = {
    right: +maxRight.toFixed(2),
    tag: maxEl ? maxEl.tagName : null,
    text: maxEl ? (maxEl.textContent||'').trim().slice(0,40) : null,
    cls: maxEl ? (maxEl.className||'').toString().slice(0,140) : null
  };

  // Top-level children of the header shell (the layout row)
  const shell = header.firstElementChild;
  out.shell = shell ? {cls: (shell.className||'').toString(), children: Array.from(shell.children).map(c => {
    const r = c.getBoundingClientRect();
    const cs = getComputedStyle(c);
    return {tag:c.tagName, cls:(c.className||'').toString().slice(0,100), display:cs.display, left:+r.left.toFixed(2), right:+r.right.toFixed(2), w:+r.width.toFixed(2), text:(c.textContent||'').trim().slice(0,50)};
  })} : null;

  return {__result: out};
})()