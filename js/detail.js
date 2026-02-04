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
  return `¥${value}`;
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
          <span>📍 ${item.location}</span>
          <span>✨ ${item.condition}</span>
          <span>📅 ${item.postedAt}</span>
        </div>

        <div class="section">
          <div class="section-label">商品描述</div>
          <div class="section-content">${item.description}</div>
        </div>

        <div class="section">
          <div class="section-label">卖家信息</div>
          <div class="seller-card">${sellerHTML}</div>
        </div>

        <button id="contactBtn" class="btn-primary btn-contact">一键联系</button>
      </div>
    </div>
  `;

  document.getElementById("contactBtn").addEventListener("click", openModal);
}

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
    detailContainer.innerHTML = "<div class='empty'>商品不存在</div>";
    return;
  }

  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) throw new Error("Failed to load");
    const products = await response.json();
    product = products.find((p) => p.id === productId);

    if (!product) {
      detailContainer.innerHTML = "<div class='empty'>商品不存在</div>";
      return;
    }

    renderDetail(product);
  } catch (error) {
    console.error("Failed to load product:", error);
    detailContainer.innerHTML = "<div class='empty'>无法加载商品数据</div>";
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
    `感谢您的留言！\n\n买家：${buyerName}\n电话：${buyerPhone}\n留言：${message}\n\n卖家会尽快与您联系。`
  );
  closeModal();
});

init();
