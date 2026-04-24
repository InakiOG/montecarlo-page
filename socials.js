const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>`,

  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>`,

  spotify: `<svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 15.5c2.3-1.1 5.1-1.3 7.5-.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M7 12.5c3-1.5 6.5-1.7 9.5-.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M6 9.5c3.7-1.8 8-2 11.5-.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  </svg>`,

  youtube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="5" width="20" height="14" rx="3"/>
    <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none"/>
  </svg>`,

  twitch: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 2L2 6v14h5v2h3l2-2h3l4-4V2H4zm15 9l-3 3h-3l-2 2v-2H7V4h12v7z"/>
    <path d="M10 7H8v5h2V7zm5 0h-2v5h2V7z"/>
  </svg>`
};

async function loadNavSocials() {
  const container = document.getElementById('navSocials');
  if (!container) return;

  try {
    const res = await fetch('data/socials.json');
    const { socials } = await res.json();

    socials.forEach(s => {
      const a = document.createElement('a');
      a.href = s.url;
      a.className = 'nav__social';
      a.setAttribute('aria-label', s.label);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      a.innerHTML = SOCIAL_ICONS[s.icon] ?? '';
      container.appendChild(a);
    });
  } catch (err) {
    console.error('Could not load socials:', err);
  }
}

window.addEventListener('DOMContentLoaded', loadNavSocials);
