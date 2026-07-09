// Shared nav + footer — injected at runtime, same pattern as contact-modal.js.
// Pages place <div data-site-nav></div> and <div data-site-footer></div>
// where the nav and footer belong.
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  const isHome = document.body.classList.contains('hero-page');

  const link = (href, label) => {
    const target = href === '/' ? 'index.html' : href.replace(/^\//, '');
    const active = page === target ? ' class="active"' : '';
    return `<li><a href="${href}"${active}>${label}</a></li>`;
  };

  const nav = document.createElement('nav');
  if (!isHome) nav.className = 'gallery-nav';
  nav.innerHTML = `
    <a href="/" class="nav-logo" id="nav-logo">Phantom Photos</a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" onclick="toggleNav(this)">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="nav-links">
      ${link('/', 'Home')}
      ${link('/about.html', 'About')}
      ${link('/sports.html', 'Sports')}
      ${link('/licensing.html', 'Licensing')}
      <li><a href="#" onclick="closeNav();openContactModal();return false;">Contact</a></li>
    </ul>`;
  const navSlot = document.querySelector('[data-site-nav]');
  if (navSlot) navSlot.replaceWith(nav);
  else document.body.prepend(nav);

  const footerHTML = `
    <div class="footer-social">
      <a href="https://www.instagram.com/phantomphotos_/" target="_blank" rel="noopener" aria-label="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
      </a>
      <a href="https://www.threads.net/@phantomphotos_" target="_blank" rel="noopener" aria-label="Threads">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/></svg>
      </a>
      <a href="https://twitter.com/phantomphotos_" target="_blank" rel="noopener" aria-label="Twitter">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="mailto:colinpeterman@gmail.com" aria-label="Email">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
      </a>
    </div>`;
  document.querySelectorAll('[data-site-footer]').forEach(slot => {
    const footer = document.createElement('footer');
    footer.className = isHome ? 'site-footer' : 'gallery-footer';
    footer.innerHTML = footerHTML;
    slot.replaceWith(footer);
  });
})();

function toggleNav(btn) {
  const open = document.getElementById('nav-links').classList.toggle('open');
  document.querySelector('nav').classList.toggle('menu-open', open);
  if (btn) btn.setAttribute('aria-expanded', open);
}

function closeNav() {
  document.getElementById('nav-links').classList.remove('open');
  const nav = document.querySelector('nav');
  nav.classList.remove('menu-open');
  const toggle = nav.querySelector('.nav-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}
