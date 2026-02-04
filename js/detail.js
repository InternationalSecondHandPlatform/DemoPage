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

function renderDetail(item) {
  const sellerHTML = `
    <img src="${item.seller.avatar}" alt="头像" class="avatar" />
    <div class="seller-info">
      <div class="seller-name">${item.seller.name}</div>
      <div class="seller-phone">${item.seller.phone}</div>
    </div>
  `;

  detailContainer.innerHTML = `
    <div class="detail-wrapper">
      <img src="${item.image}" alt="${item.name}" class="detail-image" />
      
      <div class="detail-info">
        <h1 class="detail-title">${item.name}</h1>
        
        <div class="detail-price">${formatPrice(item.price)}</div>
        
        <div class="detail-meta">
          <span>${t('location')} ${item.location}</span>
          <span>${t('condition')} ${item.condition}</span>
          <span>${t('postedAt')} ${item.postedAt}</span>
        </div>

        <div class="section">
          <div class="section-label" data-i18n="productDesc">${t('productDesc')}</div>
          <div class="section-content">${item.description}</div>
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

// Add language switcher
document.getElementById('langSwitcher').appendChild(createLanguageSwitcher());

init();
