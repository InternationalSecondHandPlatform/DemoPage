const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("searchInput");

let products = [];

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

    card.innerHTML = `
      <div class="card-title">${item.name}</div>
      <div class="card-meta">${item.location} · ${item.condition}</div>
      <div class="card-price">${formatPrice(item.price)}</div>
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

init();
