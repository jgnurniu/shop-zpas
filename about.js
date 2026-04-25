document.addEventListener('DOMContentLoaded',()=>{});

const observer = new IntersectionObserver(
  ([entry]) => { if (entry.isIntersecting) el.classList.add('is-visible'); },
  { threshold: 0.15 }
);
observer.observe(document.querySelector('.about-grid'));
