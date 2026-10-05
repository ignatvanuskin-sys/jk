(() => {
  const header = document.querySelector('header[data-site-header="true"]') || document.querySelector('header');
  const out = {innerWidth: window.innerWidth, innerHeight: window.innerHeight};
  const out2 = {};
  // consult button
  const btns = Array.from(header.querySelectorAll('button'));
  const consult = btns.find(b => (b.textContent||'').includes('Получить консультацию'));
  if (consult) {
    const cs = getComputedStyle(consult);
    const r = consult.getBoundingClientRect();
    out.consult = {display: cs.display, h:+r.height.toFixed(2), w:+r.width.toFixed(2), cls:(consult.className||'').toString()};
  } else out.consult = null;
  // hamburger
  const hb = btns.find(b => (b.className||'').toString().includes('size-11'));
  if (hb) {
    const cs = getComputedStyle(hb);
    const r = hb.getBoundingClientRect();
    out.hamburger = {display: cs.display, h:+r.height.toFixed(2), w:+r.width.toFixed(2), cls:(hb.className||'').toString()};
  } else out.hamburger = null;
  // phone at mobile
  const phone = header.querySelector('a[href^="tel:"]');
  out.phoneDisplayMobile = phone ? getComputedStyle(phone).display : null;
  // max right visible in header
  let mr=-1e9; header.querySelectorAll('*').forEach(el=>{const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden')return; const r=el.getBoundingClientRect(); if(r.width===0&&r.height===0)return; if(r.right>mr)mr=r.right;});
  out.rightmostVisible = +mr.toFixed(2);
  out.docScrollWidth = document.documentElement.scrollWidth;
  out.docClientWidth = document.documentElement.clientWidth;
  return {__result: out};
})()