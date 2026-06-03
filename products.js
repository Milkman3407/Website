const PRODUCTS = [
  {
    id: "nokia-xs010x-q-bracket",
    name: "Nokia XS010X-Q Bracket",
    description: "Printed cradle-style bracket for Nokia XS010X-Q ONT units, with raised side rails and screw-mount holes.",
    unit: "ea",
    leadTime: "Ready to print",
    material: "White filament",
    images: [
      {
        src: "Inventory/Nokia%20XS010X-Q%20Bracket/nokia-xs010x-q-bracket-empty.jpg",
        alt: "Empty Nokia XS010X-Q bracket on a 3D printer bed",
        label: "Empty bracket"
      },
      {
        src: "Inventory/Nokia%20XS010X-Q%20Bracket/nokia-xs010x-q-bracket-installed.jpg",
        alt: "Nokia XS010X-Q unit seated in the printed bracket",
        label: "Unit installed"
      }
    ]
  }
];

function loadCartEntries() {
  try {
    const raw = localStorage.getItem("printCart");
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const productIds = new Set(PRODUCTS.map((product) => product.id));

    return parsed.filter((entry) => {
      const [id, qty] = entry;
      return typeof id === "string" && productIds.has(id) && Number.isFinite(qty) && qty > 0;
    });
  } catch {
    return [];
  }
}
