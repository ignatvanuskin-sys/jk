(async () => {
  const sleep = ms => new Promise(r=>setTimeout(r,ms));
  document.documentElement.style.scrollBehavior='auto';
  const h = document.documentElement.scrollHeight;
  for (let y=0; y<=h; y+=700) { window.scrollTo(0,y); await sleep(180); }
  window.scrollTo(0, h);
  await sleep(1200);
  const imgs = Array.from(document.querySelectorAll('img'));
  const broken = imgs.filter(i=>!(i.complete && i.naturalWidth>0)).map(i=>({src:(i.currentSrc||i.src).slice(0,70), nat:i.naturalWidth, loading:i.loading}));
  window.scrollTo(0,0);
  await sleep(200);
  return {
    clientH: document.documentElement.clientHeight, innerH: window.innerHeight,
    clientW: document.documentElement.clientWidth, innerW: window.innerWidth,
    total: imgs.length, loaded: imgs.length - broken.length, brokenCount: broken.length, broken
  };
})()
