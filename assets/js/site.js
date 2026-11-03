(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  try { userPaused = localStorage.getItem('pierre-motion') === 'paused'; } catch (_) {}
  const motionButtons = document.querySelectorAll('.motion-toggle');
  const applyMotion = () => {
    const paused = userPaused || reduceMotion.matches;
    root.classList.toggle('motion-paused', paused);
    motionButtons.forEach(button => {
      button.textContent = reduceMotion.matches ? 'Reduced motion on' : paused ? 'Resume motion' : 'Pause motion';
      button.setAttribute('aria-pressed', String(paused));
      button.disabled = reduceMotion.matches;
    });
    window.dispatchEvent(new CustomEvent('portfolio:motion', { detail: { paused } }));
  };
  motionButtons.forEach(button => button.addEventListener('click', () => {
    userPaused = !userPaused;
    try { localStorage.setItem('pierre-motion', userPaused ? 'paused' : 'playing'); } catch (_) {}
    applyMotion();
  }));
  reduceMotion.addEventListener('change', applyMotion);
  applyMotion();
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const closeMenu = () => {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  };
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const opened = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(opened));
      menu.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', opened);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
    });
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
    window.matchMedia('(min-width: 541px)').addEventListener('change', closeMenu);
  }
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: .08 });
    reveals.forEach(el => observer.observe(el));
  } else { reveals.forEach(el => el.classList.add('is-visible')); }
  const art = document.querySelector('.hero-art');
  if (art && window.matchMedia('(pointer: fine)').matches) {
    art.addEventListener('pointermove', event => {
      if (root.classList.contains('motion-paused')) return;
      const rect = art.getBoundingClientRect();
      art.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width - .5) * 12}deg`);
      art.style.setProperty('--pointer-y', `${-((event.clientY - rect.top) / rect.height - .5) * 10}deg`);
    });
    art.addEventListener('pointerleave', () => {
      art.style.setProperty('--pointer-x', '0deg'); art.style.setProperty('--pointer-y', '0deg');
    });
  }
})();
