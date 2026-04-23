const products = [
  { id: "clip-v1", name: "Fiber Clip (v1)", description: "Cable management clip", unit: "ea" },
  { id: "mount-v2", name: "Wall Mount Bracket (v2)", description: "Secure hardware mount", unit: "ea" },
  { id: "tag-holder", name: "ID Tag Holder", description: "Technician tag holder", unit: "ea" },
  { id: "tool-cap", name: "Tool Cap", description: "Protective cap for field tools", unit: "ea" }
];

const cart = new Map();

const productsEl = document.getElementById("products");
const cartEl = document.getElementById("cart");
const totalEl = document.getElementById("total");
const checkoutForm = document.getElementById("checkout-form");

function renderProducts() {
  productsEl.innerHTML = "";

  for (const p of products) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <label for="qty-${p.id}">Quantity</label>
      <input id="qty-${p.id}" type="number" min="1" value="1" />
      <button data-id="${p.id}">Add to Cart</button>
    `;

    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      const qtyInput = card.querySelector("input");
      const qty = Number(qtyInput.value);
      if (!Number.isFinite(qty) || qty < 1) return;

      const current = cart.get(p.id) || 0;
      cart.set(p.id, current + qty);
      renderCart();
    });

    productsEl.appendChild(card);
  }
}

function renderCart() {
  if (cart.size === 0) {
    cartEl.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "";
    return;
  }

  const itemsHtml = [...cart.entries()]
    .map(([id, qty]) => {
      const item = products.find((p) => p.id === id);
      return `
        <li>
          ${item.name} — ${qty} ${item.unit}
          <button data-remove="${id}">Remove</button>
        </li>
      `;
    })
    .join("");

  cartEl.innerHTML = `<ul>${itemsHtml}</ul>`;
  totalEl.textContent = `Total line items: ${cart.size}`;

  cartEl.querySelectorAll("button[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cart.delete(btn.dataset.remove);
      renderCart();
    });
  });
}

function buildEmailBody(details) {
  const lines = [...cart.entries()].map(([id, qty]) => {
    const item = products.find((p) => p.id === id);
    return `- ${item.name}: ${qty} ${item.unit}`;
  });

  return [
    "New 3D print request:",
    "",
    `Technician: ${details.techName}`,
    `Email: ${details.companyEmail}`,
    `Location: ${details.workLocation}`,
    "",
    "Requested items:",
    ...lines
  ].join("\n");
}

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (cart.size === 0) {
    alert("Please add at least one item to your cart before checkout.");
    return;
  }

  const formData = new FormData(checkoutForm);
  const details = {
    techName: formData.get("techName")?.toString().trim(),
    companyEmail: formData.get("companyEmail")?.toString().trim(),
    workLocation: formData.get("workLocation")?.toString().trim()
  };

  const subject = encodeURIComponent(`3D Print Request - ${details.techName}`);
  const body = encodeURIComponent(buildEmailBody(details));

  window.location.href = `mailto:alexander.fervan@empireaccess.com?subject=${subject}&body=${body}`;
});

renderProducts();
renderCart();
