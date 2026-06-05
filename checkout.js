const REQUEST_ENDPOINT = "https://formspree.io/f/xkokkeby";

const cart = new Map(loadCartEntries());

const cartEl = document.getElementById("cart");
const totalEl = document.getElementById("total");
const checkoutForm = document.getElementById("checkout-form");
const requestSummaryEl = document.getElementById("request-summary");
const cartStatusChip = document.getElementById("cart-status-chip");

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
      unit: item.unit,
      material: item.material,
      category: item.category,
      status: item.status,
      specs: item.specs || []
    };
  }).filter(Boolean);
}

function getCheckoutDetails() {
  const formData = new FormData(checkoutForm);

  return {
    techName: formData.get("techName")?.toString().trim() || "",
    companyEmail: formData.get("companyEmail")?.toString().trim() || "",
    workLocation: formData.get("workLocation")?.toString().trim() || ""
  };
}

function renderRequestSummary() {
  if (!requestSummaryEl) return;

  requestSummaryEl.textContent = buildRequestSummary(getCheckoutDetails());
}

function renderCart() {
  if (cart.size === 0) {
    cartEl.innerHTML = "<p class='cart-empty-state'>Your cart is empty. <a href='index.html'>Add items</a> to continue.</p>";
    totalEl.textContent = "";
    if (cartStatusChip) cartStatusChip.textContent = "Cart empty";
    renderRequestSummary();
    return;
  }

  const itemsHtml = [...cart.entries()]
    .map(([id, qty]) => {
      const item = PRODUCTS.find((p) => p.id === id);
      if (!item) return "";
      const specsHtml = (item.specs || [])
        .map((spec) => `<span class="cart-item-spec">${spec.label}: ${spec.value}</span>`)
        .join("");

      return `
        <li class="cart-item-row" data-product-id="${id}">
          <div class="cart-item-copy">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-meta">${item.category || "3D print"} - ${item.material}</span>
            <span class="cart-item-quantity">${qty} ${item.unit}</span>
            <span class="cart-item-spec-list">${specsHtml}</span>
          </div>
          <button data-remove="${id}" type="button" aria-label="Remove ${item.name}">Remove</button>
        </li>
      `;
    })
    .join("");

  cartEl.innerHTML = `<ul class="cart-item-list">${itemsHtml}</ul>`;
  totalEl.textContent = `Total quantity: ${[...cart.values()].reduce((sum, qty) => sum + qty, 0)}`;
  if (cartStatusChip) cartStatusChip.textContent = "Ready to submit";
  renderRequestSummary();

  cartEl.querySelectorAll("button[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cart.delete(btn.dataset.remove);
      persistCart();
      renderCart();
    });
  });
}

function buildRequestSummary(details) {
  const lines = [
    "3D Print Request",
    "",
    `Technician: ${details.techName}`,
    `Email: ${details.companyEmail}`,
    `Location: ${details.workLocation}`,
    "",
    "Requested items:"
  ];

  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    lines.push("- No items selected");
  } else {
    cartItems.forEach((item) => {
      lines.push(`- ${item.name}: ${item.quantity} ${item.unit}`);
      lines.push(`  Material: ${item.material}`);
      lines.push(`  Category: ${item.category}`);
    });
  }

  lines.push("", `Total quantity: ${[...cart.values()].reduce((sum, qty) => sum + qty, 0)}`);
  return lines.join("\n");
}

async function submitPrintRequest(formDataPayload) {
  const response = await fetch(REQUEST_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formDataPayload
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }
}

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (cart.size === 0) {
    alert("Your cart is empty. Add at least one item before checking out.");
    return;
  }

  const details = getCheckoutDetails();

  const payload = new FormData();
  payload.set("name", details.techName);
  payload.set("email", details.companyEmail);
  payload.set("workLocation", details.workLocation);
  payload.set("subject", `3D Print Request - ${details.techName}`);
  payload.set("message", buildRequestSummary(details));

  const submitButton = document.getElementById("submit-request");
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    await submitPrintRequest(payload);
    alert("Request sent successfully.");

    checkoutForm.reset();
    cart.clear();
    persistCart();
    renderCart();
  } catch {
    alert("Unable to send request. Please try again in a moment.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Request";
  }
});

checkoutForm.addEventListener("input", renderRequestSummary);

renderCart();
