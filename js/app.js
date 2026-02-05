const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("searchInput");
const viewModeSelect = document.getElementById("viewModeSelect");

let products = [];
let viewMode = localStorage.getItem("viewMode") || "compact";

function formatPrice(value) {
  return `${t('price')}${value}`;
}

function setEmptyMessage(message) {
  empty.textContent = message || t('empty');
  empty.hidden = false;
}

function render(list) {
  grid.innerHTML = "";

  if (!list.length) {
    setEmptyMessage();
    return;
  }

  empty.hidden = true;

  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.productId = item.id;

    const detailBlocks = viewMode === "detailed"
      ? `
        <div class="card-desc">${item.description || ""}</div>
        <div class="card-section">
          <div class="card-section-label">${t("sellerInfo")}</div>
          <div class="card-seller">
            <img class="card-avatar" src="${item.seller?.avatar || ""}" alt="${item.seller?.name || ""}" />
            <div>
              <div class="card-seller-name">${item.seller?.name || ""}</div>
              <div class="card-seller-phone">${item.seller?.phone || ""}</div>
            </div>
          </div>
        </div>
      `
      : "";

    card.innerHTML = `
      <div class="card-image-wrap">
        <img class="card-image" src="${item.image}" alt="${item.name}" />
      </div>
      <div class="card-body">
        <div class="card-title">${item.name}</div>
        <div class="card-meta">${item.location} · ${item.condition}</div>
        <div class="card-price">${formatPrice(item.price)}</div>
        ${detailBlocks}
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `./detail.html?id=${item.id}`;
    });

    grid.appendChild(card);
  });
}

// Re-render on language change
window.addEventListener('languageChanged', () => {
  sortByLanguage();
  render(products);
});

function applySearch() {
  const keyword = searchInput.value.trim().toLowerCase();
  if (!keyword) {
    render(products);
    return;
  }

  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(keyword)
  );

  render(filtered);
}

function updateViewMode(mode) {
  viewMode = mode;
  localStorage.setItem("viewMode", mode);
  render(products);
}

async function init() {
  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    products = await response.json();
    sortByLanguage();
    render(products);
  } catch (error) {
    console.error("无法加载商品数据", error);
    const isFileProtocol = window.location.protocol === "file:";
    setEmptyMessage(
      isFileProtocol
        ? "无法加载商品数据，请使用本地服务器打开页面（避免 file:// 限制）"
        : "无法加载商品数据，请检查 data/products.json"
    );
  }
}

function sortByLanguage() {
  products.sort((a, b) => {
    const aMatchesLang = a.language === currentLang ? 0 : 1;
    const bMatchesLang = b.language === currentLang ? 0 : 1;
    return aMatchesLang - bMatchesLang;
  });
}

document.getElementById('langSwitcher').appendChild(createLanguageSwitcher());
searchInput.addEventListener("input", applySearch);
viewModeSelect.value = viewMode;
viewModeSelect.addEventListener("change", (e) => updateViewMode(e.target.value));

init();
