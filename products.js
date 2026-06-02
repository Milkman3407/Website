const PRODUCTS = [
  {
    id: "airties-wall-mount",
    name: "AirTies Wall Mount",
    description: "Printed wall-mount cradle for AirTies Wi-Fi units with a secure top-and-bottom hold.",
    unit: "ea",
    leadTime: "Ready to print",
    material: "Black filament",
    theme: "linear-gradient(135deg, #111827, #374151)",
    accent: "#f97316"
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
