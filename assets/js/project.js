(() => {
  'use strict';
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  const sectionSelect = document.querySelector('#section-select');
  const progress = document.querySelector('.reading-progress');
  const textButton = document.querySelector('[data-text-view]');
  const expandButton = document.querySelector('[data-expand]');
  const sections = [...gallery.querySelectorAll('.art-section')];
  const motionPaused = () => document.documentElement.classList.contains('motion-paused');
  sectionSelect?.addEventListener('change', () => {
    const section = document.getElementById(sectionSelect.value);
    if (!section) return;
    section.scrollIntoView({ behavior: motionPaused() ? 'instant' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${section.id}`);
  });
  textButton?.addEventListener('click', () => {
    const current = sections.find(s => s.getBoundingClientRect().bottom > 80);
    const active = gallery.classList.toggle('text-mode');
    textButton.setAttribute('aria-pressed', String(active));
    textButton.textContent = active ? 'Artwork view' : 'Text view';
    if (gallery.getBoundingClientRect().top < 70) current?.scrollIntoView({ behavior: 'instant' });
    updateProgress();
  });
  expandButton?.addEventListener('click', () => {
    const current = document.getElementById(sectionSelect?.value);
    const wasScrolled = gallery.getBoundingClientRect().top < 80;
    const active = gallery.classList.toggle('expanded');
    expandButton.setAttribute('aria-pressed', String(active));
    expandButton.textContent = active ? 'Fit width' : 'Expand artwork';
    if (wasScrolled) current?.scrollIntoView({ behavior: 'instant' });
    updateProgress();
  });
  let queued = false;
  function updateProgress() {
    queued = false;
    const rect = gallery.getBoundingClientRect();
    const amount = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height));
    if (progress) progress.style.transform = `scaleX(${amount})`;
    let active = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= 160) active = section;
    if (active && sectionSelect && document.activeElement !== sectionSelect) sectionSelect.value = active.id;
  }
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
  const configuration = window.PROJECT_MEDIA?.[gallery.dataset.project] || {};
  const animatedMedia = [];
  for (const [id, item] of Object.entries(configuration)) {
    if (!item.src) continue;
    const section = document.getElementById(id);
    const artwork = section?.querySelector('.artwork');
    if (!artwork) continue;
    const original = [...artwork.children];
    const isVideo = item.type === 'video' || /\.(mp4|webm)(\?|$)/i.test(item.src);
    const media = document.createElement(isVideo ? 'video' : 'img');
    const path = new URL(item.src, new URL('../', location.href)).href;
    media.setAttribute('aria-label', item.alt || section.dataset.title);
    media.hidden = true;
    media.style.display = 'none';
    let ready = false;
    let inView = true;
    const showMedia = () => {
      const show = ready && !motionPaused();
      original.forEach(el => { el.style.display = show ? 'none' : ''; });
      media.style.display = show ? 'block' : 'none'; media.hidden = !show;
      if (isVideo) {
        if (show && inView && !document.hidden) media.play().catch(() => {});
        else media.pause();
      }
    };
    if (isVideo) {
      media.muted = true; media.loop = true; media.playsInline = true; media.controls = true; media.preload = 'metadata';
      const poster = artwork.querySelector('img'); if (poster) media.poster = poster.src;
      media.addEventListener('loadedmetadata', () => { ready = true; showMedia(); });
    } else {
      media.alt = item.alt || section.dataset.title;
      media.width = Number(section.dataset.width); media.height = Number(section.dataset.height);
      media.loading = 'eager'; media.decoding = 'async';
      media.addEventListener('load', () => { ready = true; showMedia(); });
    }
    media.addEventListener('error', () => {
      ready = false; showMedia();
      console.warn(`Optional media could not load for ${id}; original artwork retained.`);
    });
    artwork.append(media); media.src = path;
    animatedMedia.push(showMedia);
    if (isVideo && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; showMedia(); });
      observer.observe(media);
    }
    document.addEventListener('visibilitychange', showMedia);
  }
  window.addEventListener('portfolio:motion', () => animatedMedia.forEach(update => update()));
  window.addEventListener('load', updateProgress, { once: true });
})();
