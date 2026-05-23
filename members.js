const MEMBER_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>`,
  twitch: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 2L2 6v14h5v2h3l2-2h3l4-4V2H4zm15 9l-3 3h-3l-2 2v-2H7V4h12v7z"/>
    <path d="M10 7H8v5h2V7zm5 0h-2v5h2V7z"/>
  </svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="5" width="20" height="14" rx="3"/>
    <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none"/>
  </svg>`
};

// Nav scroll class
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

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

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  loadMembers();
});

async function loadMembers() {
  const grid = document.getElementById('membersGrid');

  try {
    const res = await fetch('data/members.json');
    const { members } = await res.json();
    const delays = ['', ' reveal--delay-1', ' reveal--delay-2'];

    members.forEach((member, i) => {
      const article = document.createElement('article');
      article.className = `member reveal${delays[i] ?? ''}`;

      const photoContent = member.photo
        ? `<img src="${member.photo}" alt="${member.name}">`
        : `<span class="member__photo-placeholder">FOTO</span>`;

      const socialsHTML = member.socials.map(s => `
        <a href="${s.url}" class="member__social-link" aria-label="${s.platform}"
           target="_blank" rel="noopener">
          ${MEMBER_ICONS[s.platform] ?? ''}
        </a>
      `).join('');

      article.innerHTML = `
        <div class="member__photo-wrap">
          <div class="member__photo">${photoContent}</div>
          <div class="member__photo-glow"></div>
        </div>
        <div class="member__info">
          <p class="member__role"
             data-es="${member.role.es}"
             data-en="${member.role.en}">
            ${member.role[currentLang]}
          </p>
          <h2 class="member__name">${member.name}</h2>
          <p class="member__bio"
             data-es="${member.bio.es}"
             data-en="${member.bio.en}">
            ${member.bio[currentLang]}
          </p>
          <div class="member__socials">${socialsHTML}</div>
        </div>
      `;

      grid.appendChild(article);
      revealObserver.observe(article);
    });

  } catch (err) {
    console.error('Could not load members:', err);
  }
}
