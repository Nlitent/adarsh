(() => {
  const nav = document.querySelector('.navigation-bar');
  if (nav) {
    const list = nav.querySelector('ul');
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.textContent = '☰  Menu';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Toggle navigation menu');
    nav.insertBefore(toggle, nav.querySelector('nav'));
    toggle.addEventListener('click', () => {
      const open = list.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕  Close menu' : '☰  Menu';
    });
    const current = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('a[href]').forEach(link => {
      if (link.getAttribute('href').split('#')[0] === current) link.setAttribute('aria-current', 'page');
      link.addEventListener('click', () => {
        list.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰  Menu';
      });
    });
  }

  const candidates = [...document.querySelectorAll('.content, .contact-info, .gallery > div')];
  candidates.forEach(el => el.classList.add('js-reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    candidates.forEach(el => observer.observe(el));
  } else candidates.forEach(el => el.classList.add('is-visible'));

  const top = document.createElement('button');
  top.className = 'back-to-top'; top.type = 'button'; top.textContent = '↑';
  top.setAttribute('aria-label', 'Back to top'); document.body.appendChild(top);
  const updateTop = () => top.classList.toggle('visible', window.scrollY > 420);
  window.addEventListener('scroll', updateTop, { passive: true }); updateTop();
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const lightbox = document.createElement('div'); lightbox.className = 'image-lightbox';
  lightbox.setAttribute('role', 'dialog'); lightbox.setAttribute('aria-modal', 'true'); lightbox.setAttribute('aria-label', 'Image preview');
  lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close image preview">×</button><img alt="">';
  document.body.appendChild(lightbox);
  const preview = lightbox.querySelector('img');
  const close = () => { lightbox.classList.remove('open'); preview.removeAttribute('src'); document.body.style.overflow = ''; };
  document.querySelectorAll('.content img').forEach(img => {
    img.addEventListener('click', () => { preview.src = img.currentSrc || img.src; preview.alt = img.alt || 'Product image preview'; lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; });
    img.tabIndex = 0; img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); img.click(); } });
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
