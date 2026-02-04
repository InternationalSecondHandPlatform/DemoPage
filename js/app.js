const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("searchInput");

let products = [];

function formatPrice(value) {
  return `¥${value}`;
}

function setEmptyMessage(message) {
  empty.textContent = message;
  empty.hidden = false;
}

function render(list) {
  grid.innerHTML = "";

  if (!list.length) {
    setEmptyMessage("没有匹配的商品");
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

searchInput.addEventListener("input", applySearch);

init();
