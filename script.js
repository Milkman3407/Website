const cart = new Map(loadCartEntries());

const productsEl = document.getElementById("products");
const cartCountBadge = document.getElementById("cart-count-badge");
const catalogCount = document.getElementById("catalog-count");
const homeRequestSummary = document.getElementById("home-request-summary");

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

function cartItemMarkup(product, qty) {
  const previewImage = product.images?.[0];
  return `
    <article class="summary-request-item" data-product-id="${product.id}">
      <img src="${previewImage.src}" alt="${previewImage.alt}" loading="lazy" />
      <div class="summary-request-copy">
        <strong>${product.name}</strong>
        <span>${product.material.replace("filament", "PLA")}</span>
        <em>${product.leadTime}</em>
      </div>
      <div class="summary-qty-control" aria-label="${product.name} quantity">
        <button type="button" data-summary-decrement="${product.id}" aria-label="Decrease ${product.name} quantity">-</button>
        <span>${qty}</span>
        <button type="button" data-summary-increment="${product.id}" aria-label="Increase ${product.name} quantity">+</button>
      </div>
    </article>
  `;
}

function renderHomeRequestSummary() {
  if (!homeRequestSummary) return;

  const cartItems = [...cart.entries()]
    .map(([id, qty]) => {
      const product = PRODUCTS.find((candidate) => candidate.id === id);
      return product ? { product, qty } : null;
    })
    .filter(Boolean);
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  if (cartItems.length === 0) {
    homeRequestSummary.innerHTML = `
      <div class="summary-empty-state">
        <p>No prints added yet.</p>
        <span>Select quantities from the product workbench to build a request.</span>
      </div>
      <div class="summary-total-row">
        <strong>Total Quantity</strong>
        <span>0 ea</span>
      </div>
    `;
    return;
  }

  homeRequestSummary.innerHTML = `
    <div class="summary-request-list">
      ${cartItems.map((item) => cartItemMarkup(item.product, item.qty)).join("")}
    </div>
    <div class="summary-total-row">
      <strong>Total Quantity</strong>
      <span>${totalQty} ea</span>
    </div>
    <div class="summary-tech-preview">
      <strong>Technician Details</strong>
      <p>Enter technician, email, and location on checkout.</p>
    </div>
  `;

  homeRequestSummary.querySelectorAll("button[data-summary-decrement]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.summaryDecrement;
      const current = cart.get(id) || 0;
      if (current <= 1) {
        cart.delete(id);
      } else {
        cart.set(id, current - 1);
      }
      persistCart();
      updateCartBadge();
      renderHomeRequestSummary();
    });
  });

  homeRequestSummary.querySelectorAll("button[data-summary-increment]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.summaryIncrement;
      cart.set(id, (cart.get(id) || 0) + 1);
      persistCart();
      updateCartBadge();
      renderHomeRequestSummary();
    });
  });
}

function renderProducts() {
  productsEl.innerHTML = "";
  if (catalogCount) {
    catalogCount.textContent = String(PRODUCTS.length);
  }

  PRODUCTS.forEach((p) => {
    const item = document.createElement("article");
    item.className = [
      "product-item",
      "product-card",
      "workbench-secondary-product",
      `product-card--${tokenClass(p.category)}`,
      p.materialClass || `material-${tokenClass(p.material)}`
    ].join(" ");
    item.dataset.productId = p.id;
    item.dataset.category = p.category || "";
    item.dataset.material = p.material || "";
    item.innerHTML = `
      <div class="product-photo-grid">${productPhotoMarkup(p)}</div>
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
        <button data-id="${p.id}">Add to Request</button>
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
      renderHomeRequestSummary();
    });

    productsEl.appendChild(item);
  });

  renderHomeRequestSummary();
}

renderProducts();
updateCartBadge();
