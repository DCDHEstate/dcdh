// Referral constants and pure helpers shared by client components and server
// routes. Kept apart from `@/lib/referral` because that module imports the
// database client, which must never reach a client bundle.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dcdhempire.com";

export const REFERRAL_PURPOSES = [
  { value: "sell_purchase", label: "Sell / Purchase" },
  { value: "rent", label: "Rent" },
  { value: "lease", label: "Lease" },
  { value: "other", label: "Other" },
];

export const PURPOSE_LABELS = Object.fromEntries(
  REFERRAL_PURPOSES.map((p) => [p.value, p.label]),
);

// Buckets the property-referral uploader groups shots into, so an admin can
// tell an exterior shot from a kitchen without opening every file.
export const MEDIA_CATEGORIES = [
  { value: "exterior", label: "Exterior / Building" },
  { value: "living_room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
  { value: "balcony", label: "Balcony / Terrace" },
  { value: "other", label: "Other" },
];

export const MEDIA_CATEGORY_LABELS = Object.fromEntries(
  MEDIA_CATEGORIES.map((c) => [c.value, c.label]),
);

export const REFERRAL_TYPE_LABELS = {
  signup: "Link Signup",
  friend: "Person Referral",
  property: "Property Referral",
};

const VALID_PURPOSES = REFERRAL_PURPOSES.map((p) => p.value);
const VALID_CATEGORIES = MEDIA_CATEGORIES.map((c) => c.value);

export const isValidPurpose = (v) => VALID_PURPOSES.includes(v);
export const isValidMediaCategory = (v) => VALID_CATEGORIES.includes(v);

/** Uppercases and strips anything that can't be part of a code. */
export function normalizeCode(input) {
  return String(input ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

/** The link a user shares. Landing on `/` keeps it friendly for cold visitors. */
export function referralLink(code) {
  return `${SITE_URL}/?ref=${code}`;
}

export function referralShareMessage(code, referrerName) {
  const from = referrerName ? `${referrerName} here. ` : "";
  return [
    `${from}I use DCDH Empire for zero-brokerage property search.`,
    "",
    "Sign up with my link and we both earn rewards:",
    referralLink(code),
    "",
    `(Referral code: ${code})`,
  ].join("\n");
}

export function referralWhatsAppLink(code, referrerName) {
  return `https://wa.me/?text=${encodeURIComponent(
    referralShareMessage(code, referrerName),
  )}`;
}
