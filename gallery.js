// Shared row-based lazy loader for gallery pages.
// Reads the actual rendered positions after CSS columns lays out
// (mixed portrait/landscape means items per column varies), groups items
// into visual rows, then loads one row of thumbnails at a time, revealing
// each row as a unit.
function loadGalleryRows(grid) {
  const allImgs = Array.from(grid.querySelectorAll('img[data-src]'));
  const items = Array.from(grid.querySelectorAll('.masonry-item'));

  // Sort by actual top position so we load in true visual top-to-bottom order
  const sorted = items.map((el, i) => ({
    i,
    top: el.getBoundingClientRect().top
  })).sort((a, b) => a.top - b.top);

  // Group into visual rows (items within 10px of each other = same row)
  const rows = [];
  sorted.forEach(({ i, top }) => {
    const last = rows[rows.length - 1];
    if (last && Math.abs(top - last.top) < 10) {
      last.indices.push(i);
    } else {
      rows.push({ top, indices: [i] });
    }
  });

  let rowIdx = 0;
  function loadRow() {
    if (rowIdx >= rows.length) return;
    const { indices } = rows[rowIdx++];
    let done = 0;
    const finish = () => {
      done++;
      if (done === indices.length) {
        indices.forEach(j => {
          allImgs[j].classList.remove('lazy');
          allImgs[j].classList.add('loaded');
        });
        loadRow();
      }
    };
    indices.forEach(i => {
      const img = allImgs[i];
      const src = img.dataset.src;
      delete img.dataset.src;
      img.onload = finish;
      img.onerror = () => {
        img.closest('.masonry-item').style.display = 'none';
        finish();
      };
      img.src = src;
    });
  }
  loadRow();
}
