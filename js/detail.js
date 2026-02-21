let product = null;
const modal = document.getElementById("contactModal");
const form = document.getElementById("contactForm");
const closeBtn = document.querySelector(".modal-close");
const detailContainer = document.getElementById("detail");

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function formatPrice(value) {
  return `${t('price')}${value}`;
}

function getProductView(item, lang) {
  const source = item.source?.data || item;
  const translated = item.translations?.[lang];
  const mergedSeller = {
    ...(source.seller || {}),
    ...(translated?.seller || {})
  };

  return {
    ...source,
    ...(translated || {}),
    seller: mergedSeller
  };
}

function renderDetail(item) {
  const view = getProductView(item, currentLang);
  const sellerHTML = `
    <img src="${view.seller.avatar}" alt="头像" class="avatar" />
    <div class="seller-info">
      <div class="seller-name">${view.seller.name}</div>
      <div class="seller-phone">${view.seller.phone}</div>
    </div>
  `;

  detailContainer.innerHTML = `
    <div class="detail-wrapper">
      <img src="${view.image}" alt="${view.name}" class="detail-image" />
      
      <div class="detail-info">
        <h1 class="detail-title">${view.name}</h1>
        
        <div class="detail-price">${formatPrice(view.price)}</div>
        
        <div class="detail-meta">
          <span>${t('location')} ${view.location}</span>
          <span>${t('condition')} ${view.condition}</span>
          <span>${t('postedAt')} ${view.postedAt}</span>
        </div>

        <div class="section">
          <div class="section-label" data-i18n="productDesc">${t('productDesc')}</div>
          <div class="section-content">${view.description}</div>
        </div>

        <div class="section">
          <div class="section-label" data-i18n="sellerInfo">${t('sellerInfo')}</div>
          <div class="seller-card">${sellerHTML}</div>
        </div>

        <button id="contactBtn" class="btn-primary btn-contact" data-i18n="contactBtn">${t('contactBtn')}</button>
      </div>
    </div>
  `;

  document.getElementById("contactBtn").addEventListener("click", openModal);
}

// Re-render on language change
window.addEventListener('languageChanged', () => {
  if (product) renderDetail(product);
});

function openModal() {
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
  form.reset();
}

async function init() {
  const productId = getProductIdFromUrl();
  if (!productId) {
    detailContainer.innerHTML = `<div class='empty' data-i18n="productNotFound">${t('productNotFound')}</div>`;
    return;
  }

  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) throw new Error("Failed to load");
    const products = await response.json();
    product = products.find((p) => p.id === productId);

    if (!product) {
      detailContainer.innerHTML = `<div class='empty' data-i18n="productNotFound">${t('productNotFound')}</div>`;
      return;
    }

    renderDetail(product);
  } catch (error) {
    console.error("Failed to load product:", error);
    detailContainer.innerHTML = `<div class='empty' data-i18n="loadError">${t('loadError')}</div>`;
  }
}

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target === modal.querySelector(".modal-overlay")) {
    closeModal();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const buyerName = document.getElementById("buyerName").value;
  const buyerPhone = document.getElementById("buyerPhone").value;
  const message = document.getElementById("message").value;

  alert(
    `${t('thankYou')}\n\n${t('buyer')}：${buyerName}\n${t('phone')}：${buyerPhone}\n${t('message')}：${message}\n\n${t('sellerWillContact')}`
  );
  closeModal();
});

// Initialize after i18n is ready
(async function() {
  // Wait for i18n to be ready
  if (typeof i18nReady !== 'undefined') {
    await i18nReady;
  }
  
  await init();
})();
