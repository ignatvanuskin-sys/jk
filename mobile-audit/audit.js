(() => {
  const r2 = n => Math.round(n * 100) / 100;
  const d = document.documentElement;
  const out = {};

  // --- horizontal scroll ---
  out.hscroll = {
    docScrollW: d.scrollWidth,
    docClientW: d.clientWidth,
    innerW: window.innerWidth,
    pass: d.scrollWidth <= d.clientWidth + 2
  };

  // --- grid ---
  const grid = document.querySelector('ul.mt-8.grid, ul[class*="grid"]');
  const cards = Array.from(document.querySelectorAll('article.card'));
  out.cardCount = cards.length;

  if (grid) {
    const gcs = getComputedStyle(grid);
    out.grid = {
      cols: gcs.gridTemplateColumns,
      colCount: gcs.gridTemplateColumns.trim().split(/\s+/).length,
      gap: gcs.columnGap,
      gridW: r2(grid.getBoundingClientRect().width)
    };
    // first row cards
    const firstTop = Math.round(cards[0].getBoundingClientRect().top);
    const row1 = cards.filter(c => Math.abs(Math.round(c.getBoundingClientRect().top) - firstTop) <= 2);
    out.firstRowCount = row1.length;
    out.firstRowWidths = row1.map(c => r2(c.getBoundingClientRect().width));
  }

  // --- dl cells (Площадь/Этаж/Комнаты) ---
  const c0 = cards[0];
  const dl = c0.querySelector('dl');
  out.dl = { present: !!dl, gap: dl ? getComputedStyle(dl).columnGap : null, gridCols: dl ? getComputedStyle(dl).gridTemplateColumns : null };
  if (dl) {
    const cells = Array.from(dl.children); // div wrappers
    out.dlCells = cells.map(cell => {
      const dt = cell.querySelector('dt'), dd = cell.querySelector('dd');
      const ln = dt ? parseFloat(getComputedStyle(dt).lineHeight) : 0;
      const dln = dd ? parseFloat(getComputedStyle(dd).lineHeight) : 0;
      const ch = cell.getBoundingClientRect().height;
      const cr = cell.getBoundingClientRect();
      return {
        label: dt ? dt.textContent.trim() : null,
        value: dd ? dd.textContent.trim() : null,
        cellH: r2(ch),
        dtH: dt ? r2(dt.getBoundingClientRect().height) : null,
        ddH: dd ? r2(dd.getBoundingClientRect().height) : null,
        dtLines: dt && ln ? r2(dt.getBoundingClientRect().height / ln) : null,
        ddLines: dd && dln ? r2(dd.getBoundingClientRect().height / dln) : null,
        dtOverflow: dt ? dt.scrollWidth > dt.clientWidth + 1 : null,
        ddOverflow: dd ? dd.scrollWidth > dd.clientWidth + 1 : null,
        right: r2(cr.right)
      };
    });
    // any cell overlapping horizontally?
    let overlap = false;
    for (let i = 1; i < cells.length; i++) {
      const a = cells[i - 1].getBoundingClientRect(), b = cells[i].getBoundingClientRect();
      if (b.left < a.right - 0.5) overlap = true;
    }
    out.dlOverlap = overlap;
  }

  // --- "Корпус" header text single line ---
  const corpusEls = cards.map(c => Array.from(c.querySelectorAll('p')).find(p => /Корпус/.test(p.textContent))).filter(Boolean);
  out.corpus = corpusEls.map(p => {
    const ln = parseFloat(getComputedStyle(p).lineHeight);
    const h = p.getBoundingClientRect().height;
    return { text: p.textContent.trim(), h: r2(h), lines: r2(h / ln), right: r2(p.getBoundingClientRect().right) };
  });
  out.corpusAllSingleLine = out.corpus.every(c => c.lines <= 1.15);
  out.corpusMaxLines = Math.max(...out.corpus.map(c => c.lines));

  // --- overflow vs card bounds ---
  const offenders = [];
  cards.forEach((card, ci) => {
    const cr = card.getBoundingClientRect();
    card.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > cr.right + 1 || r.left < cr.left - 1) {
        offenders.push({ card: ci, tag: el.tagName, cls: (el.className || '').toString().slice(0, 60), right: r2(r.right), cardRight: r2(cr.right), over: r2(r.right - cr.right) });
      }
    });
  });
  out.cardOverflowOffenders = offenders.slice(0, 20);
  out.cardOverflowCount = offenders.length;

  // card overflow scroll
  out.cardScrollOverflow = cards.map((c, i) => ({ i, sw: c.scrollWidth, cw: c.clientWidth, over: c.scrollWidth > c.clientWidth + 1 })).filter(x => x.over);

  return { __result: out };
})()