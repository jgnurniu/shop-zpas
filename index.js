document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const shoeWraps = document.querySelectorAll('.hero-shoe-wrap');
  const buy = document.getElementById('hero-buy');
  const showcase = document.querySelector('.showcase-preview');

  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;
  let scrollProgress = 0;
  let selectedSizeBoost = 0;

  if (buy) {
    buy.addEventListener('click', () => {
      window.location.href = 'product.html?id=1';
    });
  }

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
  });

  window.addEventListener('scroll', () => {
    const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
    scrollProgress = Math.min(1, Math.max(0, window.scrollY / heroHeight));

    if (showcase) {
      showcase.style.setProperty('--section-shift', `${window.scrollY * 0.12}px`);
    }
  }, { passive: true });

  window.addEventListener('leonardise:size-change', () => {
    selectedSizeBoost = 1;
    window.setTimeout(() => {
      selectedSizeBoost = 0;
    }, 520);
  });

  function animateHero() {
    currentX += (pointerX - currentX) * 0.075;
    currentY += (pointerY - currentY) * 0.075;

    const tiltX = currentX * 6;
    const tiltY = currentY * -4.5;
    const shoeX = currentX * -34;
    const mouseX = `${currentX * 100}px`;
    const mouseY = `${currentY * 100}px`;
    const scrollShift = `${scrollProgress * -42}px`;
    const scale = 1 + scrollProgress * 0.035 + selectedSizeBoost * 0.025;

    if (hero) {
      hero.style.setProperty('--mouse-x', mouseX);
      hero.style.setProperty('--mouse-y', mouseY);
      hero.style.setProperty('--tilt-x', `${tiltX}deg`);
      hero.style.setProperty('--tilt-y', `${tiltY}deg`);
      hero.style.setProperty('--shoe-x', `${shoeX}px`);
      hero.style.setProperty('--scroll-shift', scrollShift);
      hero.style.setProperty('--shoe-scale', scale.toFixed(3));
    }

    shoeWraps.forEach((shoe, index) => {
      const depth = index === 0 ? 1 : 1.12;
      shoe.style.filter = `brightness(${1 + Math.abs(currentX) * 0.08}) saturate(${1 + Math.abs(currentY) * 0.08 * depth})`;
    });

    requestAnimationFrame(animateHero);
  }

  animateHero();
});
