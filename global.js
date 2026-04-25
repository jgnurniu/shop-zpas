function header() {
  return '<nav class="nav"><a class="logo magnetic" href="index.html">Leonardise</a><div class="nav-links"><a class="magnetic" href="index.html">Home</a><a class="magnetic" href="about.html">About</a><a class="magnetic" href="pricing.html">Pricing</a><a class="magnetic" href="contact.html">Contact</a></div><div class="nav-actions"><div class="size-pills"><button class="size-pill magnetic" data-size="12"><span>12</span></button><button class="size-pill magnetic" data-size="14"><span>14</span></button><button class="size-pill magnetic" data-size="16"><span>16</span></button></div><a class="profile-icon magnetic" href="login.html" aria-label="Login"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg></a></div></nav>';
}

function footer() {
  return '<footer class="site-footer"><div class="footer-grid"><div><div class="footer-logo">Leonardise</div><p class="muted">Wear your style with confidence.</p></div><div><h4 class="footer-heading">Navegación</h4><div class="footer-links"><a href="index.html">Home</a><a href="products.html">Shop</a><a href="about.html">About</a><a href="contact.html">Contact</a></div></div><div><h4 class="footer-heading">Soporte</h4><div class="footer-links"><a href="contact.html">Envíos</a><a href="contact.html">Devoluciones</a><a href="contact.html">FAQ</a><a href="pricing.html">Términos y condiciones</a></div></div><div><h4 class="footer-heading">Social / Contacto</h4><div class="footer-links"><a href="https://instagram.com">Instagram</a><a href="https://twitter.com">Twitter</a><a href="mailto:studio@leonardise.com">studio@leonardise.com</a></div></div></div><div class="footer-bottom"><span>© 2026 Leonardise</span><span>Premium footwear interface</span></div></footer>';
}

function mountChrome() {
  const headerTarget = document.getElementById('site-header');
  const footerTarget = document.getElementById('site-footer');

  if (headerTarget) {
    headerTarget.innerHTML = header();
  }

  if (footerTarget) {
    footerTarget.innerHTML = footer();
  }

  bindPremiumCursor();
  bindSizePills();
  bindButtonGlow();
  bindMagneticElements();
}

async function apiGet(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Request failed');
  }

  return response.json();
}

async function apiPost(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || 'Request failed');
  }

  return json;
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function bindPremiumCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  const orb = document.createElement('div');
  const dot = document.createElement('div');
  orb.className = 'cursor-orb';
  dot.className = 'cursor-dot';
  document.body.append(orb, dot);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let orbX = targetX;
  let orbY = targetY;

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
    orb.classList.add('visible');
    dot.classList.add('visible');
  });

  document.addEventListener('pointerover', (event) => {
    if (event.target.closest('a, button, input, textarea, select, .product-card, .related-card')) {
      orb.classList.add('hovering');
    }
  });

  document.addEventListener('pointerout', (event) => {
    if (event.target.closest('a, button, input, textarea, select, .product-card, .related-card')) {
      orb.classList.remove('hovering');
    }
  });

  function animateCursor() {
    orbX += (targetX - orbX) * 0.16;
    orbY += (targetY - orbY) * 0.16;
    orb.style.transform = `translate3d(${orbX}px, ${orbY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

function bindSizePills() {
  document.querySelectorAll('.size-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.size-pill').forEach((item) => item.classList.remove('active'));
      pill.classList.add('active', 'size-pop');
      document.documentElement.style.setProperty('--selected-size-pulse', pill.dataset.size || '12');
      window.setTimeout(() => pill.classList.remove('size-pop'), 420);
      window.dispatchEvent(new CustomEvent('leonardise:size-change', { detail: { size: pill.dataset.size } }));
    });
  });
}

function bindButtonGlow() {
  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      button.style.setProperty('--btn-x', `${x}%`);
      button.style.setProperty('--btn-y', `${y}%`);
    });
  });
}

function bindMagneticElements() {
  if (!window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.14}px, ${y * 0.22}px)`;
    });

    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', mountChrome);
