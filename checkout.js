const REQUEST_ENDPOINT = "https://formspree.io/f/xkokkeby";

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

  if (REQUEST_ENDPOINT.includes("YOUR_FORM_ID")) {
    alert("Set REQUEST_ENDPOINT in checkout.js with your real Formspree form URL before submitting requests.");
    return;
  }

  const formData = new FormData(checkoutForm);
  const details = {
    techName: formData.get("techName")?.toString().trim(),
    companyEmail: formData.get("companyEmail")?.toString().trim(),
    workLocation: formData.get("workLocation")?.toString().trim()
  };

  const payload = new FormData();
  payload.set("technicianName", details.techName || "");
  payload.set("companyEmail", details.companyEmail || "");
  payload.set("workLocation", details.workLocation || "");
  payload.set("items", JSON.stringify(getCartItems()));

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

renderCart();
