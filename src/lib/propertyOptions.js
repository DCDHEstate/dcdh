// Shared listing option lists and formatters.
// Single source of truth for the post-property form, the edit form, and every
// page that renders a listing (public detail, admin detail, search, cards).

// ─── Amenities (society / building level) ─────────────────────────────────────

export const AMENITY_LIST = [
  { id: "power_backup", label: "Power Backup" },
  { id: "lift", label: "Lift / Elevator" },
  { id: "gym", label: "Gym" },
  { id: "swimming_pool", label: "Swimming Pool" },
  { id: "security", label: "24x7 Security" },
  { id: "cctv", label: "CCTV" },
  { id: "garden", label: "Garden" },
  { id: "club_house", label: "Club House" },
  { id: "parking", label: "Parking" },
  { id: "visitor_parking", label: "Visitor Parking" },
  { id: "intercom", label: "Intercom" },
  { id: "fire_safety", label: "Fire Safety" },
  { id: "rainwater_harvesting", label: "Rainwater Harvesting" },
  { id: "solar_panels", label: "Solar Panels" },
  { id: "gated_society", label: "Gated Society" },
];

export const AMENITY_LABELS = Object.fromEntries(
  AMENITY_LIST.map((a) => [a.id, a.label]),
);

// ─── Furnishings (what is actually inside the home) ───────────────────────────

export const FURNISHING_LEVELS = [
  { id: "furnished", label: "Furnished" },
  { id: "semi_furnished", label: "Semi-Furnished" },
  { id: "unfurnished", label: "Unfurnished" },
];

// Levels that warrant an itemised furnishing list.
export const FURNISHED_LEVELS = ["furnished", "semi_furnished"];

export const FURNISHING_GROUPS = [
  {
    group: "Kitchen",
    items: [
      { id: "modular_kitchen", label: "Modular Kitchen" },
      { id: "refrigerator", label: "Refrigerator" },
      { id: "microwave", label: "Microwave" },
      { id: "stove", label: "Gas Stove / Hob" },
      { id: "chimney", label: "Chimney" },
      { id: "water_purifier", label: "Water Purifier" },
      { id: "dishwasher", label: "Dishwasher" },
    ],
  },
  {
    group: "Living & Dining",
    items: [
      { id: "sofa", label: "Sofa" },
      { id: "dining_table", label: "Dining Table" },
      { id: "tv", label: "TV" },
      { id: "tv_unit", label: "TV Unit" },
      { id: "center_table", label: "Center Table" },
      { id: "curtains", label: "Curtains" },
    ],
  },
  {
    group: "Bedroom",
    items: [
      { id: "bed", label: "Bed" },
      { id: "mattress", label: "Mattress" },
      { id: "wardrobe", label: "Wardrobe" },
      { id: "dressing_table", label: "Dressing Table" },
      { id: "study_table", label: "Study Table" },
    ],
  },
  {
    group: "Appliances & Comfort",
    items: [
      { id: "ac", label: "Air Conditioner" },
      { id: "fan", label: "Ceiling Fan" },
      { id: "geyser", label: "Geyser / Water Heater" },
      { id: "washing_machine", label: "Washing Machine" },
      { id: "exhaust_fan", label: "Exhaust Fan" },
      { id: "lights", label: "Light Fittings" },
      { id: "inverter", label: "Power Inverter" },
    ],
  },
];

export const FURNISHING_ITEMS = FURNISHING_GROUPS.flatMap((g) => g.items);

export const FURNISHING_LABELS = Object.fromEntries(
  FURNISHING_ITEMS.map((f) => [f.id, f.label]),
);

// Regroups a stored id array back into display groups, dropping empty groups.
export function groupFurnishings(ids) {
  const selected = new Set(ids || []);
  return FURNISHING_GROUPS.map((g) => ({
    group: g.group,
    items: g.items.filter((i) => selected.has(i.id)),
  })).filter((g) => g.items.length > 0);
}

// Server-side guard: an unfurnished listing never stores an item list, and only
// known ids are persisted so the detail pages never render junk labels.
export function normalizeFurnishings(furnishing, furnishings) {
  if (!FURNISHED_LEVELS.includes(furnishing)) return [];
  return toArray(furnishings).filter((id) => id in FURNISHING_LABELS);
}

// ─── Other listing option lists ──────────────────────────────────────────────

export const AGE_OPTIONS = [
  "Under Construction",
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

export const FACING_OPTIONS = [
  "North",
  "South",
  "East",
  "West",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
];

// ─── Formatting ───────────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS = { INR: "₹", AED: "AED " };
const CURRENCY_LOCALES = { INR: "en-IN", AED: "en-AE" };

export function currencySymbol(currency) {
  const code = currency || "INR";
  return CURRENCY_SYMBOLS[code] ?? `${code} `;
}

/**
 * Formats a listing price for the property's own currency.
 * Lakh / Crore shorthand is only applied to INR — an AED amount is grouped
 * in the western style instead.
 *
 * @param {number|string} value
 * @param {string} currency  'INR' | 'AED' | any ISO code
 * @param {{ compact?: boolean, showSymbol?: boolean }} [options]
 *   compact    — use Cr / L shorthand for large INR amounts (default true)
 *   showSymbol — prefix the currency symbol (default true)
 */
export function formatPrice(value, currency, options = {}) {
  const { compact = true, showSymbol = true } = options;
  const code = currency || "INR"; // rows predating the currency column read null
  const n = Number(value);
  if (value == null || !Number.isFinite(n)) return "—";

  const symbol = showSymbol ? currencySymbol(code) : "";

  if (compact && code === "INR") {
    if (n >= 10000000) return `${symbol}${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `${symbol}${(n / 100000).toFixed(1)} L`;
  }
  if (compact && code !== "INR" && n >= 1000000) {
    return `${symbol}${(n / 1000000).toFixed(2)}M`;
  }

  const locale = CURRENCY_LOCALES[code] ?? "en-US";
  return `${symbol}${n.toLocaleString(locale)}`;
}

// ─── JSONB helpers ────────────────────────────────────────────────────────────

// `postgres` returns jsonb as a parsed array, but older rows / string columns
// can still arrive as text. Normalises either shape to an array.
export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
