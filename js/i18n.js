let currentLang = localStorage.getItem('lang') || 'zh';
let translations = {};

async function loadTranslations() {
  try {
    const response = await fetch('./data/i18n.json');
    translations = await response.json();
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
}

function t(key) {
  return translations[currentLang]?.[key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  updatePageLanguage();
}

function updatePageLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else if (el.tagName === 'OPTION') {
      el.textContent = t(key);
    } else {
      el.textContent = t(key);
    }
  });

  // Handle placeholder translations
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Handle option element translations
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  // Dispatch custom event for components to update
  window.dispatchEvent(new CustomEvent('languageChanged'));
}

function createLanguageSwitcher() {
  const switcher = document.createElement('div');
  switcher.className = 'lang-switcher';
  switcher.innerHTML = `
    <button class="lang-btn ${currentLang === 'zh' ? 'active' : ''}" data-lang="zh">中</button>
    <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">En</button>
  `;
  
  switcher.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      switcher.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setLanguage(lang);
    });
  });
  
  return switcher;
}

// Initialize and expose ready promise
let i18nReady;
i18nReady = (async function() {
  await loadTranslations();
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    await new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }
  updatePageLanguage();
  
  // Mount language switcher if element exists
  const langSwitcherEl = document.getElementById('langSwitcher');
  if (langSwitcherEl && !langSwitcherEl.hasChildNodes()) {
    langSwitcherEl.appendChild(createLanguageSwitcher());
  }
})();
