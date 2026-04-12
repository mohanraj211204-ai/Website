/* ═══════════════════════════════════════════
   PORTFOLIO — app.js
   All dynamic content, settings, localStorage
═══════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────
// DEFAULT STATE
// ──────────────────────────────────────────
const DEFAULTS = {
  password: 'admin123',
  profile: {
    navName: 'Portfolio',
    heroName: 'Your Name Here',
    heroTagline: 'Your tagline goes here — developer, designer, dreamer.',
    about1: 'Add a short introduction about yourself here. Who are you? What drives you? What\'s your story?',
    about2: 'Add more details — your background, passions, professional philosophy, or anything you\'d like visitors to know.',
    statExp: '0+',
    statProjects: '0+',
    statClients: '0+',
    profileImg: '',
    footerName: 'Your Name',
  },
  skills: [],
  certs: [],
  resume: {
    desc: 'Download or view my resume to learn more about my experience, education, and achievements.',
    url: '',
  },
  contact: {
    email: 'your@email.com',
    phone: '+00 000 000 0000',
    location: 'Your City, Country',
    intro: 'Feel free to reach out for collaborations, opportunities, or just a hello.',
    socials: [],
  }
};

// ──────────────────────────────────────────
// STATE HELPERS
// ──────────────────────────────────────────
const getState = (key) => {
  try {
    const v = localStorage.getItem('portfolio_' + key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
};
const setState = (key, val) => {
  localStorage.setItem('portfolio_' + key, JSON.stringify(val));
};
const load = (key, def) => getState(key) ?? def;

// ──────────────────────────────────────────
// LOAD SITE DATA
// ──────────────────────────────────────────
let siteProfile = load('profile', { ...DEFAULTS.profile });
let siteSkills  = load('skills', [...DEFAULTS.skills]);
let siteCerts   = load('certs', [...DEFAULTS.certs]);
let siteResume  = load('resume', { ...DEFAULTS.resume });
let siteContact = load('contact', { ...DEFAULTS.contact });

// ──────────────────────────────────────────
// RENDER FUNCTIONS
// ──────────────────────────────────────────

function renderProfile() {
  const p = siteProfile;
  setTxt('nav-logo-text', p.navName);
  setTxt('hero-name', p.heroName);
  setTxt('hero-tagline', p.heroTagline);
  setTxt('about-text-1', p.about1);
  setTxt('about-text-2', p.about2);
  setTxt('stat-exp', p.statExp);
  setTxt('stat-projects', p.statProjects);
  setTxt('stat-clients', p.statClients);
  setTxt('footer-name', p.footerName);

  const imgEl = document.getElementById('about-img');
  const phEl  = document.getElementById('about-img-placeholder');
  if (p.profileImg) {
    imgEl.src = p.profileImg;
    imgEl.style.display = 'block';
    if (phEl) phEl.style.display = 'none';
  } else {
    imgEl.src = '';
    imgEl.style.display = 'none';
    if (phEl) phEl.style.display = 'flex';
  }
}

function renderSkills() {
  const grid = document.getElementById('skills-grid');
  const emptyMsg = document.getElementById('skills-empty-msg');
  grid.innerHTML = '';
  if (!siteSkills.length) {
    emptyMsg.classList.add('show');
    return;
  }
  emptyMsg.classList.remove('show');
  siteSkills.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.style.animationDelay = `${i * 0.06}s`;

    const isEmoji = /\p{Emoji}/u.test(s.icon) || s.icon.length <= 3;
    const iconHtml = s.icon
      ? (isEmoji
          ? `<span class="skill-icon">${escHtml(s.icon)}</span>`
          : `<span class="skill-icon"><img src="${escHtml(s.icon)}" alt="${escHtml(s.name)}" onerror="this.style.display='none'" /></span>`)
      : '';

    card.innerHTML = `
      ${iconHtml}
      <span class="skill-name">${escHtml(s.name)}</span>
      ${s.category ? `<span class="skill-category">${escHtml(s.category)}</span>` : ''}
      ${s.level ? `
        <div class="skill-bar-wrap">
          <div class="skill-bar" data-level="${s.level}" style="width:0%"></div>
        </div>` : ''}
    `;
    grid.appendChild(card);
  });
  // Animate bars on scroll
  requestAnimationFrame(() => {
    grid.querySelectorAll('.skill-bar').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.level + '%'; }, 200);
    });
  });
}

function renderCerts() {
  const grid = document.getElementById('certs-grid');
  const empty = document.getElementById('certs-empty-msg');
  grid.innerHTML = '';
  if (!siteCerts.length) {
    empty.classList.add('show');
    return;
  }
  empty.classList.remove('show');
  siteCerts.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'cert-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="cert-badge">${escHtml(c.icon || '🏅')}</div>
      <div class="cert-title">${escHtml(c.title)}</div>
      <div class="cert-issuer">${escHtml(c.issuer)}</div>
      <div class="cert-year">${escHtml(c.year)}</div>
      ${c.url ? `<a class="cert-link" href="${escHtml(c.url)}" target="_blank" rel="noopener">View Certificate →</a>` : ''}
    `;
    grid.appendChild(card);
  });
}

function renderResume() {
  const r = siteResume;
  setTxt('resume-desc', r.desc || DEFAULTS.resume.desc);
  const viewBtn = document.getElementById('view-resume-btn');
  const dlBtn   = document.getElementById('download-resume-btn');
  const note    = document.getElementById('resume-note');
  if (r.url) {
    viewBtn.href = r.url;
    dlBtn.href   = r.url;
    viewBtn.style.opacity = '1'; dlBtn.style.opacity = '1';
    if (note) note.style.display = 'none';
  } else {
    viewBtn.href = '#'; dlBtn.href = '#';
    viewBtn.style.opacity = '0.45'; dlBtn.style.opacity = '0.45';
    if (note) note.style.display = '';
  }
}

function renderContact() {
  const c = siteContact;
  setTxt('contact-intro', c.intro);
  const emailEl    = document.getElementById('ci-email');
  const phoneEl    = document.getElementById('ci-phone');
  const locationEl = document.getElementById('ci-location');
  if (emailEl) { emailEl.textContent = c.email || 'your@email.com'; emailEl.href = c.email ? `mailto:${c.email}` : '#'; }
  if (phoneEl) { phoneEl.textContent = c.phone || '+00 000 000 0000'; phoneEl.href = c.phone ? `tel:${c.phone}` : '#'; }
  if (locationEl) locationEl.textContent = c.location || 'Your City, Country';

  // Social links
  const sl = document.getElementById('social-links');
  sl.innerHTML = '';
  if (!c.socials || !c.socials.length) {
    sl.innerHTML = '<span class="no-social-msg">No social links added yet.</span>';
    return;
  }
  c.socials.forEach(s => {
    const a = document.createElement('a');
    a.className = 'social-link-btn';
    a.href = s.url || '#';
    a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = `${s.icon ? escHtml(s.icon) + ' ' : ''}${escHtml(s.label)}`;
    sl.appendChild(a);
  });
}

function renderAll() {
  renderProfile();
  renderSkills();
  renderCerts();
  renderResume();
  renderContact();
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

// ──────────────────────────────────────────
// SETTINGS PANEL — POPULATE FIELDS
// ──────────────────────────────────────────
function populateSettings() {
  const p = siteProfile;
  setValue('s-nav-name', p.navName);
  setValue('s-hero-name', p.heroName);
  setValue('s-hero-tagline', p.heroTagline);
  setValue('s-about-1', p.about1);
  setValue('s-about-2', p.about2);
  setValue('s-stat-exp', p.statExp);
  setValue('s-stat-projects', p.statProjects);
  setValue('s-stat-clients', p.statClients);
  setValue('s-profile-img', p.profileImg);
  setValue('s-footer-name', p.footerName);

  const r = siteResume;
  setValue('s-resume-desc', r.desc);
  setValue('s-resume-url', r.url);
  updateResumeInfo();

  const c = siteContact;
  setValue('s-email', c.email);
  setValue('s-phone', c.phone);
  setValue('s-location', c.location);
  setValue('s-contact-intro', c.intro);

  renderSkillsManage();
  renderCertsManage();
  renderSocialManage();
}

// ──────────────────────────────────────────
// SKILLS MANAGE
// ──────────────────────────────────────────
function renderSkillsManage() {
  const list = document.getElementById('skills-manage-list');
  list.innerHTML = '';
  if (!siteSkills.length) {
    list.innerHTML = '<p style="color:var(--text-faint);font-size:.85rem">No skills yet. Add some above.</p>';
    return;
  }
  siteSkills.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'manage-item';
    row.innerHTML = `
      <div class="manage-item-info">
        <span class="manage-item-title">${escHtml(s.icon || '')} ${escHtml(s.name)}</span>
        <span class="manage-item-sub">${escHtml(s.category || '')} ${s.level ? '· ' + s.level + '%' : ''}</span>
      </div>
      <button class="manage-item-del" data-i="${i}">Delete</button>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('.manage-item-del').forEach(btn => {
    btn.addEventListener('click', () => {
      siteSkills.splice(+btn.dataset.i, 1);
      setState('skills', siteSkills);
      renderSkills();
      renderSkillsManage();
    });
  });
}

document.getElementById('addSkillBtn').addEventListener('click', () => {
  const name = val('s-skill-name');
  if (!name.trim()) { alert('Skill name is required.'); return; }
  siteSkills.push({
    name: name.trim(),
    icon: val('s-skill-icon').trim(),
    level: val('s-skill-level') || '',
    category: val('s-skill-category').trim(),
  });
  setState('skills', siteSkills);
  renderSkills();
  renderSkillsManage();
  clearFields(['s-skill-name','s-skill-icon','s-skill-level','s-skill-category']);
  toast('Skill added!');
});

// ──────────────────────────────────────────
// CERTS MANAGE
// ──────────────────────────────────────────
function renderCertsManage() {
  const list = document.getElementById('certs-manage-list');
  list.innerHTML = '';
  if (!siteCerts.length) {
    list.innerHTML = '<p style="color:var(--text-faint);font-size:.85rem">No certificates yet.</p>';
    return;
  }
  siteCerts.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'manage-item';
    row.innerHTML = `
      <div class="manage-item-info">
        <span class="manage-item-title">${escHtml(c.icon || '🏅')} ${escHtml(c.title)}</span>
        <span class="manage-item-sub">${escHtml(c.issuer)} · ${escHtml(c.year)}</span>
      </div>
      <button class="manage-item-del" data-i="${i}">Delete</button>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('.manage-item-del').forEach(btn => {
    btn.addEventListener('click', () => {
      siteCerts.splice(+btn.dataset.i, 1);
      setState('certs', siteCerts);
      renderCerts();
      renderCertsManage();
    });
  });
}

document.getElementById('addCertBtn').addEventListener('click', () => {
  const title = val('s-cert-title');
  if (!title.trim()) { alert('Certificate title is required.'); return; }
  siteCerts.push({
    title: title.trim(),
    issuer: val('s-cert-issuer').trim(),
    year: val('s-cert-year').trim(),
    url: val('s-cert-url').trim(),
    icon: val('s-cert-icon').trim() || '🏅',
  });
  setState('certs', siteCerts);
  renderCerts();
  renderCertsManage();
  clearFields(['s-cert-title','s-cert-issuer','s-cert-year','s-cert-url','s-cert-icon']);
  toast('Certificate added!');
});

// ──────────────────────────────────────────
// SOCIAL MANAGE
// ──────────────────────────────────────────
function renderSocialManage() {
  const c = siteContact;
  const wrap = document.getElementById('social-manage');
  wrap.innerHTML = '';
  (c.socials || []).forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'social-row';
    row.innerHTML = `
      <div class="field-group">
        <label>Label</label>
        <input type="text" class="soc-label" data-i="${i}" value="${escAttr(s.label)}" placeholder="GitHub" />
      </div>
      <div class="field-group">
        <label>URL</label>
        <input type="text" class="soc-url" data-i="${i}" value="${escAttr(s.url)}" placeholder="https://..." />
      </div>
      <div class="field-group" style="min-width:70px">
        <label>Icon</label>
        <input type="text" class="soc-icon" data-i="${i}" value="${escAttr(s.icon || '')}" placeholder="🐱" style="text-align:center" />
      </div>
      <button class="social-del-btn" data-i="${i}">✕</button>
    `;
    wrap.appendChild(row);
  });
  wrap.querySelectorAll('.social-del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      c.socials.splice(+btn.dataset.i, 1);
      renderSocialManage();
    });
  });
}

document.getElementById('addSocialBtn').addEventListener('click', () => {
  if (!siteContact.socials) siteContact.socials = [];
  siteContact.socials.push({ label: '', url: '', icon: '' });
  renderSocialManage();
});

// ──────────────────────────────────────────
// SAVE HANDLERS
// ──────────────────────────────────────────

// Save Profile
document.getElementById('saveProfile').addEventListener('click', () => {
  const imgUrl = val('s-profile-img');
  siteProfile = {
    navName: val('s-nav-name') || DEFAULTS.profile.navName,
    heroName: val('s-hero-name') || DEFAULTS.profile.heroName,
    heroTagline: val('s-hero-tagline') || DEFAULTS.profile.heroTagline,
    about1: val('s-about-1') || DEFAULTS.profile.about1,
    about2: val('s-about-2') || DEFAULTS.profile.about2,
    statExp: val('s-stat-exp') || '0+',
    statProjects: val('s-stat-projects') || '0+',
    statClients: val('s-stat-clients') || '0+',
    profileImg: imgUrl,
    footerName: val('s-footer-name') || DEFAULTS.profile.footerName,
  };
  setState('profile', siteProfile);
  renderProfile();
  toast('Profile saved! ✓');
});

// Profile image upload
document.getElementById('s-profile-upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById('s-profile-img').value = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// Save Resume
document.getElementById('saveResume').addEventListener('click', () => {
  const urlField = val('s-resume-url');
  siteResume = {
    desc: val('s-resume-desc') || DEFAULTS.resume.desc,
    url: urlField,
  };
  setState('resume', siteResume);
  renderResume();
  updateResumeInfo();
  toast('Resume settings saved! ✓');
});

// Resume PDF upload → base64
document.getElementById('s-resume-upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById('s-resume-url').value = ev.target.result;
    updateResumeInfo();
    toast('PDF loaded — click Save Resume to apply.');
  };
  reader.readAsDataURL(file);
});

function updateResumeInfo() {
  const info = document.getElementById('current-resume-info');
  const url = val('s-resume-url');
  if (url && url.startsWith('data:')) {
    info.textContent = '✓ PDF uploaded (base64 stored locally)';
  } else if (url) {
    info.textContent = '✓ Resume URL: ' + url.slice(0, 50) + '…';
  } else {
    info.textContent = 'No resume set yet.';
  }
}

// Save Contact
document.getElementById('saveContact').addEventListener('click', () => {
  // Sync social inputs before saving
  const socials = [];
  const labels = document.querySelectorAll('.soc-label');
  const urls   = document.querySelectorAll('.soc-url');
  const icons  = document.querySelectorAll('.soc-icon');
  labels.forEach((_, i) => {
    socials.push({
      label: labels[i].value.trim(),
      url:   urls[i].value.trim(),
      icon:  icons[i].value.trim(),
    });
  });

  siteContact = {
    email:    val('s-email'),
    phone:    val('s-phone'),
    location: val('s-location'),
    intro:    val('s-contact-intro'),
    socials,
  };
  setState('contact', siteContact);
  renderContact();
  toast('Contact info saved! ✓');
});

// ──────────────────────────────────────────
// SECURITY — CHANGE PASSWORD
// ──────────────────────────────────────────
document.getElementById('changePassBtn').addEventListener('click', () => {
  const cur  = val('s-cur-pass');
  const nw   = val('s-new-pass');
  const conf = val('s-conf-pass');
  const msg  = document.getElementById('pass-msg');
  const storedPass = getState('password') || DEFAULTS.password;

  if (cur !== storedPass) { msg.style.color = '#e74c3c'; msg.textContent = '✗ Current password incorrect.'; return; }
  if (!nw || nw.length < 4) { msg.style.color = '#e74c3c'; msg.textContent = '✗ New password too short (min 4 chars).'; return; }
  if (nw !== conf) { msg.style.color = '#e74c3c'; msg.textContent = '✗ Passwords do not match.'; return; }

  setState('password', nw);
  msg.style.color = '#27ae60'; msg.textContent = '✓ Password changed successfully!';
  clearFields(['s-cur-pass','s-new-pass','s-conf-pass']);
  setTimeout(() => { msg.textContent = ''; }, 3500);
});

// Reset all data
document.getElementById('resetAllBtn').addEventListener('click', () => {
  if (!confirm('Reset ALL portfolio data to defaults? This cannot be undone!')) return;
  ['profile','skills','certs','resume','contact','password'].forEach(k => localStorage.removeItem('portfolio_' + k));
  siteProfile = { ...DEFAULTS.profile };
  siteSkills  = [];
  siteCerts   = [];
  siteResume  = { ...DEFAULTS.resume };
  siteContact = { ...DEFAULTS.contact };
  renderAll();
  populateSettings();
  toast('All data reset to defaults.');
});

// ──────────────────────────────────────────
// LOCK SCREEN LOGIC
// ──────────────────────────────────────────
const lockOverlay    = document.getElementById('lockOverlay');
const settingsOverlay = document.getElementById('settingsOverlay');
const lockInput      = document.getElementById('lockInput');
const lockError      = document.getElementById('lockError');

document.getElementById('settingsGear').addEventListener('click', () => {
  lockOverlay.classList.add('active');
  lockInput.value = '';
  lockError.textContent = '';
  setTimeout(() => lockInput.focus(), 300);
});

document.getElementById('lockClose').addEventListener('click', () => {
  lockOverlay.classList.remove('active');
});

// Close lock overlay clicking backdrop
lockOverlay.addEventListener('click', (e) => {
  if (e.target === lockOverlay) lockOverlay.classList.remove('active');
});

function tryUnlock() {
  const pass = lockInput.value;
  const stored = getState('password') || DEFAULTS.password;
  if (pass === stored) {
    lockOverlay.classList.remove('active');
    settingsOverlay.classList.add('active');
    populateSettings();
    lockError.textContent = '';
  } else {
    lockError.textContent = '✗ Incorrect password. Try again.';
    lockInput.value = '';
    lockInput.focus();
    lockInput.classList.add('shake');
    setTimeout(() => lockInput.classList.remove('shake'), 500);
  }
}

document.getElementById('lockSubmit').addEventListener('click', tryUnlock);
lockInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });

// ──────────────────────────────────────────
// SETTINGS PANEL — TABS & CLOSE
// ──────────────────────────────────────────
document.getElementById('settingsClose').addEventListener('click', () => {
  settingsOverlay.classList.remove('active');
});
settingsOverlay.addEventListener('click', (e) => {
  if (e.target === settingsOverlay) settingsOverlay.classList.remove('active');
});

document.querySelectorAll('.stab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.stab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ──────────────────────────────────────────
// THEME TOGGLE
// ──────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
let isDark = (getState('theme') ?? 'dark') === 'dark';

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
  setState('theme', isDark ? 'dark' : 'light');
}
applyTheme();

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  applyTheme();
});

// ──────────────────────────────────────────
// REVEAL ON SCROLL
// ──────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

// ──────────────────────────────────────────
// NAV — highlight on scroll
// ──────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--rose)' : '';
  });
}, { passive: true });

// ──────────────────────────────────────────
// TOAST NOTIFICATION
// ──────────────────────────────────────────
function toast(msg) {
  const t = document.getElementById('settings-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ──────────────────────────────────────────
// UTILITY HELPERS
// ──────────────────────────────────────────
function setTxt(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}
function setValue(id, v) {
  const el = document.getElementById(id);
  if (el) el.value = v || '';
}
function clearFields(ids) {
  ids.forEach(id => setValue(id, ''));
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) {
  return String(s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Shake animation for lock input
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
  .shake { animation: shake 0.45s ease; }
`;
document.head.appendChild(shakeStyle);

// ──────────────────────────────────────────
// INIT
// ──────────────────────────────────────────
renderAll();
initReveal();