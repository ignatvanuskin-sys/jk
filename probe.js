(() => {
  const header = document.querySelector('header') || document.body.firstElementChild;
  if (!header) return {__result: {error: 'no header'}};
  const rect = header.getBoundingClientRect();
  const links = Array.from(header.querySelectorAll('a, button')).map(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      text: (el.textContent || '').trim().slice(0, 40),
      href: el.getAttribute('href'),
      h: +r.height.toFixed(2),
      w: +r.width.toFixed(2),
      right: +r.right.toFixed(2),
      top: +r.top.toFixed(2),
      display: cs.display,
      cls: (el.className || '').toString().slice(0, 120)
    };
  });
  const nav = header.querySelector('nav');
  const navItems = nav ? Array.from(nav.querySelectorAll('a, button')).map(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      text: (el.textContent || '').trim().slice(0, 40),
      h: +r.height.toFixed(2),
      w: +r.width.toFixed(2),
      top: +r.top.toFixed(2),
      display: cs.display,
      cls: (el.className || '').toString().slice(0, 120)
    };
  }) : null;
  return {__result: {
    header: {w: +rect.width.toFixed(2), h: +rect.height.toFixed(2), right: +rect.right.toFixed(2), left: +rect.left.toFixed(2), cls: (header.className||'').toString().slice(0,200)},
    headerHTML: header.outerHTML.slice(0, 500),
    navItems,
    links
  }};
})()