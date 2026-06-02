const cart = new Map(loadCartEntries());

const cartEl = document.getElementById("cart");
const totalEl = document.getElementById("total");
const checkoutForm = document.getElementById("checkout-form");

function persistCart() {
  localStorage.setItem("printCart", JSON.stringify([...cart.entries()]));
}

function getCartItems() {
  return [...cart.entries()].map(([id, qty]) => {
    const item = PRODUCTS.find((p) => p.id === id);
    if (!item) return null;

    return {
      id: item.id,
      name: item.name,
      quantity: qty,
      unit: item.unit
    };
  }).filter(Boolean);
}

function renderCart() {
  if (cart.size === 0) {
    cartEl.innerHTML = "<p>Your cart is empty. <a href='index.html'>Add items</a> to continue.</p>";
    totalEl.textContent = "";
    return;
  }

  const itemsHtml = [...cart.entries()]
    .map(([id, qty]) => {
      const item = PRODUCTS.find((p) => p.id === id);
      if (!item) return "";
      return `
        <li>
          ${item.name} — ${qty} ${item.unit}
          <button data-remove="${id}" type="button">Remove</button>
        </li>
      `;
    })
    .join("");

  cartEl.innerHTML = `<ul>${itemsHtml}</ul>`;
  totalEl.textContent = `Total quantity: ${[...cart.values()].reduce((sum, qty) => sum + qty, 0)}`;

  cartEl.querySelectorAll("button[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cart.delete(btn.dataset.remove);
      persistCart();
      renderCart();
    });
  });
}

function buildRequestSummary() {
  const lines = ["3D Print Request", "", "Items:"];

  getCartItems().forEach((item) => {
    lines.push(`- ${item.name}: ${item.quantity} ${item.unit}`);
  });

  lines.push("", `Total quantity: ${[...cart.values()].reduce((sum, qty) => sum + qty, 0)}`);
  return lines.join("\n");
}

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (cart.size === 0) {
    alert("Your cart is empty. Add at least one item before preparing a request summary.");
    return;
  }

  const summary = buildRequestSummary();
  const summaryEl = document.getElementById("request-summary");
  const submitButton = document.getElementById("submit-request");

  summaryEl.textContent = summary;

  try {
    await navigator.clipboard.writeText(summary);
    submitButton.textContent = "Copied";
  } catch {
    submitButton.textContent = "Summary Ready";
  } finally {
    window.setTimeout(() => {
      submitButton.textContent = "Copy Request Summary";
    }, 1800);
  }
});

renderCart();
