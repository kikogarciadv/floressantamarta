// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('menu');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

// Cerrar el menú al elegir una sección
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

// Galería: ampliar fotos
const shots = [...document.querySelectorAll('.gallery img')];
if (shots.length) {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Foto ampliada');
  box.innerHTML = '<img alt=""><button class="lb-close" aria-label="Cerrar">×</button>' +
    '<button class="lb-prev" aria-label="Foto anterior">‹</button><button class="lb-next" aria-label="Foto siguiente">›</button>';
  document.body.appendChild(box);
  const big = box.querySelector('img');
  let current = 0;
  let opener = null;

  const show = (i) => {
    current = (i + shots.length) % shots.length;
    big.src = shots[current].src;
    big.alt = shots[current].alt;
  };
  // Al cerrar, el foco vuelve a la foto que se abrió
  const close = () => {
    box.classList.remove('open');
    if (opener) opener.focus();
  };

  shots.forEach((img, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Ampliar: ' + img.alt);
    img.replaceWith(btn);
    btn.appendChild(img);
    btn.addEventListener('click', () => { opener = btn; show(i); box.classList.add('open'); box.querySelector('.lb-close').focus(); });
  });

  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
    // Mantener el foco dentro de la foto ampliada
    if (e.key === 'Tab') {
      const btns = [...box.querySelectorAll('button')];
      const i = btns.indexOf(document.activeElement);
      const next = e.shiftKey ? i - 1 : i + 1;
      if (next < 0 || next >= btns.length) { e.preventDefault(); btns[(next + btns.length) % btns.length].focus(); }
    }
  });
}

// Mapa: cargar Google Maps solo al pulsar
const map = document.querySelector('.map[data-src]');
if (map) {
  map.querySelector('.map-load').addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.title = 'Mapa: Flores Santa Marta, Calle Osario 20, Córdoba';
    frame.src = map.dataset.src;
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    map.replaceChildren(frame);
  });
}
