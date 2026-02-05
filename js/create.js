const createForm = document.getElementById("createForm");
const notification = document.getElementById("notification");
const previewName = document.getElementById("previewName");
const previewMeta = document.getElementById("previewMeta");
const previewPrice = document.getElementById("previewPrice");
const previewDescription = document.getElementById("previewDescription");
const previewSellerName = document.getElementById("previewSellerName");
const previewSellerPhone = document.getElementById("previewSellerPhone");
const previewImage = document.getElementById("previewImage");
const previewAvatar = document.getElementById("previewAvatar");

const previewImagePlaceholder =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ4MCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI4IiBmaWxsPSIjNjY2IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9kdWN0IFByZXZpZXc8L3RleHQ+PC9zdmc+";

function showNotification(message, type = "success") {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.hidden = false;
  
  setTimeout(() => {
    notification.hidden = true;
  }, 3000);
}

/**
 * Mock API: Submit new product
 * In a real application, this would make a POST request to your backend
 * @param {Object} productData - The product data to submit
 * @returns {Promise<Object>} - The response from the server
 */
async function submitProductToAPI(productData) {
  // TODO: Replace with actual API endpoint when backend is ready
  // Example: const response = await fetch('/api/products', { 
  //   method: 'POST', 
  //   body: JSON.stringify(productData),
  //   headers: { 'Content-Type': 'application/json' }
  // })
  
  console.log("📤 Submitting product to API:", productData);
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: t('submitSuccess'),
        data: productData
      });
    }, 800);
  });
}

function generateProductId() {
  return `p-${Date.now()}`;
}

function generateAvatar() {
  const colors = ["#d1e7f0", "#fdd1f6", "#e1f2f7"];
  const bgColors = ["#66b2ff", "#f09bd2", "#99ffcc"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  
  const color = colors[randomIndex];
  const bgColor = bgColors[randomIndex];
  
  return `data:image/svg+xml;base64,${btoa(`<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="${color}"/><circle cx="24" cy="12" r="8" fill="${bgColor}"/><path d="M6 32c0-4 4-8 8-8 8 4 4 8 0 0 8 0 0 8 0 4 8z" fill="${bgColor}"/></svg>`)}`;
}

function updatePreview() {
  const nameValue = document.getElementById("productName").value.trim();
  const priceValue = document.getElementById("productPrice").value.trim();
  const conditionValue = document.getElementById("productCondition").value.trim();
  const locationValue = document.getElementById("productLocation").value.trim();
  const descriptionValue = document.getElementById("productDescription").value.trim();
  const sellerNameValue = document.getElementById("sellerName").value.trim();
  const sellerPhoneValue = document.getElementById("sellerPhone").value.trim();

  previewName.textContent = nameValue || t("previewNameEmpty");
  previewPrice.textContent = priceValue
    ? `${t("price")}${priceValue}`
    : t("previewPriceEmpty");

  if (locationValue || conditionValue) {
    previewMeta.textContent = [locationValue, conditionValue].filter(Boolean).join(" · ");
  } else {
    previewMeta.textContent = t("previewMetaEmpty");
  }

  previewDescription.textContent = descriptionValue || t("previewDescriptionEmpty");
  previewSellerName.textContent = sellerNameValue || t("previewSellerNameEmpty");
  previewSellerPhone.textContent = sellerPhoneValue || t("previewSellerPhoneEmpty");
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const productData = {
    id: generateProductId(),
    name: document.getElementById("productName").value,
    price: parseInt(document.getElementById("productPrice").value),
    condition: document.getElementById("productCondition").value,
    location: document.getElementById("productLocation").value,
    description: document.getElementById("productDescription").value,
    language: currentLang || "zh",
    image: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNjY2IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9kdWN0PC90ZXh0Pjwvc3ZnPg==`,
    seller: {
      name: document.getElementById("sellerName").value,
      phone: document.getElementById("sellerPhone").value,
      avatar: generateAvatar()
    },
    postedAt: new Date().toISOString().split('T')[0]
  };

  try {
    // Submit to mock API
    const response = await submitProductToAPI(productData);
    
    if (response.success) {
      showNotification(t('submitSuccess'), "success");
      // Redirect to home page after 1.5 seconds
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1500);
    } else {
      showNotification(t('submitError'), "error");
    }
  } catch (error) {
    console.error("Error submitting product:", error);
    showNotification(t('submitError'), "error");
  }
}

// Initialize language switcher
document.getElementById('langSwitcher').appendChild(createLanguageSwitcher());

previewImage.src = previewImagePlaceholder;
previewAvatar.src = generateAvatar();
updatePreview();

window.addEventListener("languageChanged", () => {
  updatePreview();
});

// Form submission event listener
createForm.addEventListener("submit", handleFormSubmit);
createForm.addEventListener("input", updatePreview);
