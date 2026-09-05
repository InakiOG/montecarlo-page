// Nav: add .scrolled class on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Scroll reveal via IntersectionObserver
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

function observeReveal(els) {
  els.forEach(el => revealObserver.observe(el));
}

// Hero elements: trigger immediately on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible'));
  observeReveal(document.querySelectorAll('.reveal:not(.hero .reveal)'));
  loadTourDates();
});

// Language toggle
const langToggle = document.getElementById('langToggle');
let currentLang = 'es';

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  document.documentElement.lang = currentLang;
  langToggle.textContent = currentLang === 'en' ? 'ES' : 'EN';
  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    el.innerHTML = el.dataset[currentLang];
  });
});

// Tour dates — sorted closest → furthest, PAGE_SIZE at a time
const PAGE_SIZE = 5;
let tourShows  = [];
let tourPage   = 0;

async function loadTourDates() {
  const list        = document.getElementById('tourList');
  const wrap        = document.getElementById('tourMoreWrap');
  const moreBtn     = document.getElementById('tourMoreBtn');
  const collapseBtn = document.getElementById('tourCollapseBtn');

  try {
    const res = await fetch(`data/tour.json?v=${Date.now()}`, { cache: 'no-store' });
    const { dates } = await res.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tourShows = dates
      .filter(s => s.isoDate && new Date(s.isoDate) >= today)
      .sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));

    renderPage();

    moreBtn.addEventListener('click', () => {
      renderPage();
      moreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    collapseBtn.addEventListener('click', () => {
      // Remove all items beyond the first PAGE_SIZE
      const items = list.querySelectorAll('.tour__item');
      items.forEach((item, i) => { if (i >= PAGE_SIZE) item.remove(); });
      tourPage = 1;
      syncButtons();
      document.getElementById('tour').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

  } catch (err) {
    console.error('Could not load tour dates:', err);
  }

  function renderPage() {
    const slice    = tourShows.slice(tourPage * PAGE_SIZE, (tourPage + 1) * PAGE_SIZE);
    const newItems = [];

    slice.forEach(show => {
      const item = document.createElement('div');
      item.className = 'tour__item reveal';
      const labelEs = show.buttonLabel ? show.buttonLabel.es : 'Entradas';
      const labelEn = show.buttonLabel ? show.buttonLabel.en : 'Tickets';
      item.innerHTML = `
        <div class="tour__date">
          <span class="tour__month" data-es="${show.month.es}" data-en="${show.month.en}">
            ${show.month[currentLang]}
          </span>
          <span class="tour__day">${show.day}</span>
        </div>
        <div class="tour__info">
          <p class="tour__venue">${show.venue}</p>
          <p class="tour__city">${show.city}</p>
        </div>
        <div class="tour__action">
          ${show.ticketsUrl === 'PENDING' ? `
          <p class="tour__status" data-es="PROXIMAMENTE" data-en="COMING SOON">
            ${currentLang === 'es' ? 'PROXIMAMENTE' : 'COMING SOON'}
          </p>
          <a class="btn btn--sm btn--disabled" aria-disabled="true" tabindex="-1"
             data-es="${labelEs}" data-en="${labelEn}">
            ${currentLang === 'es' ? labelEs : labelEn}
          </a>` : `
          <a href="${show.ticketsUrl}" class="btn btn--sm" target="_blank" rel="noopener"
             data-es="${labelEs}" data-en="${labelEn}">
            ${currentLang === 'es' ? labelEs : labelEn}
          </a>${show.mgTicketsUrl ? `
          <a href="${show.mgTicketsUrl}" class="btn btn--sm btn--ghost" target="_blank" rel="noopener"
             data-es="Experiencia M&amp;G" data-en="Meet &amp; Greet">
            ${currentLang === 'es' ? 'Experiencia M&G' : 'Meet & Greet'}
          </a>` : ''}`}
        </div>
      `;
      list.appendChild(item);
      newItems.push(item);
    });

    observeReveal(newItems);
    tourPage++;
    syncButtons();
  }

  function syncButtons() {
    const total      = list.querySelectorAll('.tour__item').length;
    const hasMore    = tourPage * PAGE_SIZE < tourShows.length;
    const isExpanded = total > PAGE_SIZE;

    wrap.hidden          = !hasMore && !isExpanded;
    moreBtn.hidden       = !hasMore;
    collapseBtn.hidden   = !isExpanded;
  }
}
