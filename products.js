const PRODUCTS = [
  {
    id: "airties-wall-mount",
    name: "AirTies Wall Mount",
    description: "Printed wall-mount cradle for AirTies Wi-Fi units with a secure top-and-bottom hold.",
    unit: "ea",
    leadTime: "Ready to print",
    material: "Black filament",
    images: [
      {
        src: "https://media.githubusercontent.com/media/Milkman3407/Website/main/Inventory/AirTies%20Wall%20Mount/airties-wall-mount-bracket.jpg",
        alt: "AirTies wall mount bracket before installation",
        label: "Bracket"
      },
      {
        src: "https://media.githubusercontent.com/media/Milkman3407/Website/main/Inventory/AirTies%20Wall%20Mount/airties-wall-mount-installed.jpg",
        alt: "AirTies wall mount installed with an AirTies Wi-Fi unit",
        label: "Installed"
      }
    ],
    theme: "linear-gradient(135deg, #111827, #374151)",
    accent: "#f97316"
  },
  {
    id: "nokia-xs010x-q-bracket",
    name: "Nokia XS010X-Q Bracket",
    description: "Printed cradle-style bracket for Nokia XS010X-Q ONT units, with raised side rails and screw-mount holes.",
    unit: "ea",
    leadTime: "Ready to print",
    material: "White filament",
    theme: "linear-gradient(135deg, #0f172a, #475569)",
    accent: "#38bdf8"
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
