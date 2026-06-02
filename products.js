const PRODUCTS = [
  {
    id: "clip-v1",
    name: "Fiber Clip (v1)",
    description: "Cable routing clip for cleaner runs in tight cabinets.",
    unit: "ea",
    leadTime: "2-day print",
    theme: "linear-gradient(135deg, #2563eb, #06b6d4)"
  },
  {
    id: "mount-v2",
    name: "Wall Mount Bracket (v2)",
    description: "Heavy-duty mount with reinforced ribs for secure installs.",
    unit: "ea",
    leadTime: "3-day print",
    theme: "linear-gradient(135deg, #1e3a8a, #2563eb)"
  },
  {
    id: "tag-holder",
    name: "ID Tag Holder",
    description: "Durable holder for technician labels and equipment IDs.",
    unit: "ea",
    leadTime: "2-day print",
    theme: "linear-gradient(135deg, #0f766e, #14b8a6)"
  },
  {
    id: "tool-cap",
    name: "Tool Cap",
    description: "Protective end cap that shields specialty field tools.",
    unit: "ea",
    leadTime: "1-day print",
    theme: "linear-gradient(135deg, #312e81, #7c3aed)"
  }
];

function loadCartEntries() {
  try {
    const raw = localStorage.getItem("printCart");
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((entry) => {
      const [id, qty] = entry;
      return typeof id === "string" && Number.isFinite(qty) && qty > 0;
    });
  } catch {
    return [];
  }
}
