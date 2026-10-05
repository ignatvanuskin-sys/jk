(() => {
  // Find all apartment cards = article elements that contain a "Подробнее" link
  const arts = Array.from(document.querySelectorAll('article')).filter(a =>
    a.querySelector('a[href]') && /Корпус|комнатная/.test(a.textContent)
  );

  const cards = arts.map((a, i) => {
    const r = a.getBoundingClientRect();
    // label paragraph: contains "Корпус"
    const ps = Array.from(a.querySelectorAll('p'));
    let labelP = ps.find(p => /Корпус/.test(p.textContent));
    let pricePerP = ps.find(p => /за м²/.test(p.textContent));
    // Also title heading for identification
    const h = a.querySelector('h2,h3,h4');
    const title = h ? h.textContent.trim() : '';
    const num = (() => {
      const p0 = ps[0] ? ps[0].textContent.trim() : '';
      return p0;
    })();

    function lines(el) {
      if (!el) return null;
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = Array.from(range.getClientRects()).filter(r => r.height > 0);
      // merge rects on same top
      const tops = [...new Set(rects.map(r => Math.round(r.top)))];
      return tops.length;
    }
    function fs(el) {
      if (!el) return null;
      return getComputedStyle(el).fontSize;
    }

    return {
      i,
      num,
      title,
      label: labelP ? labelP.textContent.replace(/\s+/g, ' ').trim() : null,
      labelLines: lines(labelP),
      labelHeight: labelP ? +labelP.getBoundingClientRect().height.toFixed(1) : null,
      labelFont: fs(labelP),
      labelWhiteSpace: labelP ? getComputedStyle(labelP).whiteSpace : null,
      pricePerText: pricePerP ? pricePerP.textContent.replace(/\s+/g, ' ').trim() : null,
      pricePerFont: fs(pricePerP),
      cardTop: +r.top.toFixed(1),
      cardLeft: +r.left.toFixed(1),
      cardWidth: +r.width.toFixed(1),
      cardHeight: +r.height.toFixed(1),
    };
  });

  // group into rows by cardTop
  const rows = {};
  cards.forEach(c => {
    const key = Math.round(c.cardTop / 5) * 5;
    (rows[key] = rows[key] || []).push(c);
  });
  const rowSummary = Object.keys(rows).sort((a,b)=>a-b).map(k => ({
    top: +k,
    count: rows[k].length,
    heights: rows[k].map(c => c.cardHeight),
    min: Math.min(...rows[k].map(c=>c.cardHeight)),
    max: Math.max(...rows[k].map(c=>c.cardHeight)),
  }));

  const target = cards.find(c => c.label && /Корпус A/.test(c.label));

  return {
    __result: {
      device: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
      cardCount: cards.length,
      cards: cards.slice(0, 14),
      rowSummary,
      target,
    }
  };
})()
