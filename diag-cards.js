(() => {
  const arts = Array.from(document.querySelectorAll('article')).filter(a =>
    a.querySelector('a[href]') && /Корпус|комнатная/.test(a.textContent)
  );
  const cards = arts.map((a, i) => {
    const r = a.getBoundingClientRect();
    const ps = Array.from(a.querySelectorAll('p'));
    const tags = Array.from(a.querySelectorAll('li'));
    const dl = a.querySelector('dl');
    const labelP = ps.find(p => /Корпус/.test(p.textContent));
    const num = ps[0] ? ps[0].textContent.trim() : '';
    const h = a.querySelector('h2,h3,h4');
    return {
      i, num, title: h ? h.textContent.trim() : '',
      h: +r.height.toFixed(1),
      top: +r.top.toFixed(1),
      q: a.textContent.includes('""') ? 1 : 0,
      numTags: tags.length,
      tagTexts: tags.map(t=>t.textContent.trim()).filter(Boolean),
      tagListH: tags[0] ? +tags[0].parentElement.getBoundingClientRect().height.toFixed(1) : 0,
      dlH: dl ? +dl.getBoundingClientRect().height.toFixed(1) : 0,
      labelText: labelP ? labelP.textContent.replace(/\s+/g,' ').trim() : null,
      txt: a.textContent.replace(/\s+/g,' ').trim().slice(0,180),
    };
  });
  const grid = arts[0] ? arts[0].parentElement : null;
  const gridStyle = grid ? { display: getComputedStyle(grid).display, alignItems: getComputedStyle(grid).alignItems, gridTemplate: getComputedStyle(grid).gridTemplateColumns, gap: getComputedStyle(grid).gap } : null;
  return { __result: { gridStyle, cards } };
})()
