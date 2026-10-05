(() => {
  const arts = Array.from(document.querySelectorAll('article')).filter(a =>
    a.querySelector('a[href]') && /Корпус|комнатная/.test(a.textContent)
  );
  const cards = arts.map((a, i) => {
    const r = a.getBoundingClientRect();
    const ps = Array.from(a.querySelectorAll('p'));
    const labelP = ps.find(p => /Корпус/.test(p.textContent));
    const pricePerP = ps.find(p => /за м²/.test(p.textContent));
    const h = a.querySelector('h2,h3,h4');
    function lines(el) {
      if (!el) return null;
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = Array.from(range.getClientRects()).filter(r => r.height > 0);
      return [...new Set(rects.map(r => Math.round(r.top)))].length;
    }
    return {
      i,
      num: ps[0] ? ps[0].textContent.trim() : '',
      title: h ? h.textContent.trim() : '',
      label: labelP ? labelP.textContent.replace(/\s+/g,' ').trim() : null,
      labelLines: lines(labelP),
      labelHeight: labelP ? +labelP.getBoundingClientRect().height.toFixed(1) : null,
      labelFont: labelP ? getComputedStyle(labelP).fontSize : null,
      labelWs: labelP ? getComputedStyle(labelP).whiteSpace : null,
      pricePerText: pricePerP ? pricePerP.textContent.replace(/\s+/g,' ').trim() : null,
      pricePerFont: pricePerP ? getComputedStyle(pricePerP).fontSize : null,
      top: +r.top.toFixed(1),
      left: +r.left.toFixed(1),
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
    };
  });

  // tag wrap causes heights; capture tag list height for first 4
  const tagH = arts.slice(0,4).map(a => {
    const li = a.querySelector('li');
    return li ? +li.parentElement.getBoundingClientRect().height.toFixed(1) : 0;
  });

  // scroll grid into view
  const first = arts[0];
  if (first) first.scrollIntoView({ block: 'start' });

  const ul = arts[0] ? arts[0].closest('ul') : null;

  return {
    __result: {
      device: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
      cardCount: cards.length,
      cards: cards.slice(0, 4),
      tagHeights: tagH,
      ulClass: ul ? ul.className : null,
      ulParentClass: ul && ul.parentElement ? ul.parentElement.className : null,
      firstCardTopAfterScroll: first ? +first.getBoundingClientRect().top.toFixed(1) : null,
    }
  };
})()
