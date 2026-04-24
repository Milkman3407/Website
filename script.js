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

function renderProducts() {
  productsEl.innerHTML = "";

  for (const p of PRODUCTS) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-media" style="background: ${p.theme}">
        <span class="product-unit">${p.unit}</span>
        <span class="product-tag">${p.leadTime}</span>
      </div>
      <h3 class="card-title">${p.name}</h3>
      <p>${p.description}</p>
      <div class="card-form-row">
        <div class="qty-field">
          <label for="qty-${p.id}">Quantity</label>
          <input id="qty-${p.id}" type="number" min="1" value="1" />
        </div>
        <button data-id="${p.id}">Add to Cart</button>
      </div>
    `;

    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      const qtyInput = card.querySelector("input");
      const qty = Number(qtyInput.value);
      if (!Number.isFinite(qty) || qty < 1) return;

      const current = cart.get(p.id) || 0;
      cart.set(p.id, current + qty);
      persistCart();
      updateCartBadge();
    });

    productsEl.appendChild(card);
  }
}

renderProducts();
updateCartBadge();
