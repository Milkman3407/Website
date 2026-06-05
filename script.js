const cart = new Map(loadCartEntries());

const productsEl = document.getElementById("products");
const cartCountBadge = document.getElementById("cart-count-badge");
const catalogCount = document.getElementById("catalog-count");

function persistCart() {
  localStorage.setItem("printCart", JSON.stringify([...cart.entries()]));
}

function updateCartBadge() {
  const totalQty = [...cart.values()].reduce((sum, qty) => sum + qty, 0);
  cartCountBadge.textContent = String(totalQty);
}

function tokenClass(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function productPhotoMarkup(product) {
  return product.images
    .map(
      (image) => `
        <figure class="product-photo">
          <img src="${image.src}" alt="${image.alt}" loading="lazy" />
          <figcaption>${image.label}</figcaption>
        </figure>
      `
    )
    .join("");
}

function productBadgeMarkup(product) {
  const badges = [product.status, product.category, ...(product.badges || [])].filter(Boolean);

  return badges
    .map((badge) => `<span class="product-badge product-badge--${tokenClass(badge)}">${badge}</span>`)
    .join("");
}

function productSpecMarkup(product) {
  return (product.specs || [])
    .map(
      (spec) => `
        <li class="product-spec product-spec--${tokenClass(spec.label)}">
          <span class="product-spec__label">${spec.label}</span>
          <span class="product-spec__value">${spec.value}</span>
        </li>
      `
    )
    .join("");
}

function renderProducts() {
  productsEl.innerHTML = "";
  if (catalogCount) {
    catalogCount.textContent = String(PRODUCTS.length);
  }

  for (const p of PRODUCTS) {
    const item = document.createElement("article");
    item.className = [
      "product-item",
      "product-card",
      "product-row",
      `product-card--${tokenClass(p.category)}`,
      p.materialClass || `material-${tokenClass(p.material)}`
    ].join(" ");
    item.dataset.productId = p.id;
    item.dataset.category = p.category || "";
    item.dataset.material = p.material || "";
    item.innerHTML = `
      <div class="product-photo-grid">
        ${productPhotoMarkup(p)}
      </div>
      <div class="product-copy">
        <div class="product-heading-row">
          <div class="product-title-block">
            <span class="product-kicker">${p.equipmentFamily || p.category || "Field equipment"}</span>
            <h3 class="product-title">${p.name}</h3>
          </div>
          <span class="product-tag product-status-tag">${p.leadTime}</span>
        </div>
        <p>${p.description}</p>
        <div class="product-badge-row" aria-label="${p.name} badges">
          ${productBadgeMarkup(p)}
        </div>
        <ul class="product-spec-list" aria-label="${p.name} specs">
          ${productSpecMarkup(p)}
        </ul>
        <p class="product-detail material-badge ${p.materialClass || `material-${tokenClass(p.material)}`}">${p.material}</p>
      </div>
      <div class="product-actions">
        <div class="qty-field">
          <label for="qty-${p.id}">Quantity</label>
          <input id="qty-${p.id}" type="number" min="1" value="1" />
        </div>
        <button data-id="${p.id}">Add to Cart</button>
      </div>
    `;

    const btn = item.querySelector("button");
    btn.addEventListener("click", () => {
      const qtyInput = item.querySelector("input");
      const qty = Number(qtyInput.value);
      if (!Number.isFinite(qty) || qty < 1) return;

      const current = cart.get(p.id) || 0;
      cart.set(p.id, current + qty);
      persistCart();
      updateCartBadge();
    });

    productsEl.appendChild(item);
  }
}

renderProducts();
updateCartBadge();
