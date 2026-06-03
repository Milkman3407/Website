const cart = new Map(loadCartEntries());

const productsEl = document.getElementById("products");
const cartCountBadge = document.getElementById("cart-count-badge");

function persistCart() {
  localStorage.setItem("printCart", JSON.stringify([...cart.entries()]));
}

function updateCartBadge() {
  const totalQty = [...cart.values()].reduce((sum, qty) => sum + qty, 0);
  cartCountBadge.textContent = String(totalQty);
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

function renderProducts() {
  productsEl.innerHTML = "";

  for (const p of PRODUCTS) {
    const item = document.createElement("article");
    item.className = "product-item";
    item.innerHTML = `
      <div class="product-photo-grid">
        ${productPhotoMarkup(p)}
      </div>
      <div class="product-copy">
        <div class="product-heading-row">
          <h3 class="product-title">${p.name}</h3>
          <span class="product-tag">${p.leadTime}</span>
        </div>
        <p>${p.description}</p>
        <p class="product-detail">${p.material}</p>
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
