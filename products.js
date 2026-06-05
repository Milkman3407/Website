const PRODUCTS = [
  {
    id: "nokia-xs010x-q-bracket",
    name: "Nokia XS010X-Q Bracket",
    description: "Printed cradle-style bracket for Nokia XS010X-Q ONT units, with raised side rails and screw-mount holes.",
    unit: "ea",
    leadTime: "Ready to print",
    material: "White filament",
    materialClass: "material-white-filament",
    category: "ONT bracket",
    equipmentFamily: "Nokia ONT",
    status: "Field ready",
    badges: ["ONT mount", "Screw mount", "Cradle bracket"],
    specs: [
      { label: "Equipment", value: "Nokia XS010X-Q" },
      { label: "Install", value: "Wall bracket" },
      { label: "Finish", value: "White filament" }
    ],
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
  },
  {
    id: "airties-bracket",
    name: "AirTies Bracket",
    description: "Printed bracket for AirTies Wi-Fi units, with a fitted top clip and lower support cradle.",
    unit: "ea",
    leadTime: "Ready to print",
    material: "Black filament",
    materialClass: "material-black-filament",
    category: "Wi-Fi bracket",
    equipmentFamily: "AirTies Wi-Fi",
    status: "Field ready",
    badges: ["Wi-Fi mount", "Top clip", "Support cradle"],
    specs: [
      { label: "Equipment", value: "AirTies Wi-Fi" },
      { label: "Install", value: "Wall bracket" },
      { label: "Finish", value: "Black filament" }
    ],
    images: [
      {
        src: "Inventory/AirTies/AirTie%2001.jpg",
        alt: "Empty black AirTies bracket on a 3D printer bed",
        label: "Empty bracket"
      },
      {
        src: "Inventory/AirTies/AirTie%2002.jpg",
        alt: "AirTies Wi-Fi unit seated in the printed bracket",
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
