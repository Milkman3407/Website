const products = [
  { id: "clip-v1", name: "Fiber Clip (v1)", description: "Cable management clip", unit: "ea" },
  { id: "mount-v2", name: "Wall Mount Bracket (v2)", description: "Secure hardware mount", unit: "ea" },
  { id: "tag-holder", name: "ID Tag Holder", description: "Technician tag holder", unit: "ea" },
  { id: "tool-cap", name: "Tool Cap", description: "Protective cap for field tools", unit: "ea" }
];

const REQUEST_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const cart = new Map();

const productsEl = document.getElementById("products");
const cartEl = document.getElementById("cart");
const totalEl = document.getElementById("total");
const checkoutForm = document.getElementById("checkout-form");
const modelPhotosInput = document.getElementById("modelPhotos");
const photoPreviewEl = document.getElementById("photo-preview");

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

function getCartItems() {
  return [...cart.entries()].map(([id, qty]) => {
    const item = products.find((p) => p.id === id);
    return {
      id: item.id,
      name: item.name,
      quantity: qty,
      unit: item.unit
    };
  });
}

function renderPhotoPreview(files) {
  photoPreviewEl.innerHTML = "";

  if (files.length === 0) {
    return;
  }

  [...files].slice(0, 6).forEach((file) => {
    const image = document.createElement("img");
    image.alt = file.name;
    image.src = URL.createObjectURL(file);
    photoPreviewEl.appendChild(image);
  });
}

async function submitPrintRequest(formDataPayload) {
  const response = await fetch(REQUEST_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: formDataPayload
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }
}

modelPhotosInput.addEventListener("change", () => {
  const files = modelPhotosInput.files ? [...modelPhotosInput.files] : [];
  renderPhotoPreview(files);
});

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (cart.size === 0) {
    alert("Please add at least one item to your cart before checkout.");
    return;
  }

  if (REQUEST_ENDPOINT.includes("YOUR_FORM_ID")) {
    alert("Set REQUEST_ENDPOINT in script.js with your real Formspree form URL before submitting requests.");
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

  const imageFiles = modelPhotosInput.files ? [...modelPhotosInput.files] : [];
  imageFiles.forEach((file) => payload.append("modelPhotos", file));

  const submitButton = document.getElementById("submit-request");
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    await submitPrintRequest(payload);
    alert("Request sent successfully.");

    checkoutForm.reset();
    cart.clear();
    renderCart();
    renderPhotoPreview([]);
  } catch (error) {
    alert("Unable to send request. Please try again in a moment.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Request";
  }
});

renderProducts();
renderCart();
