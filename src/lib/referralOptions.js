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

// Subsets of the `property_category` / `property_type` enums that make sense
// for a referral. Validated server-side too — an unknown value would otherwise
// surface as a database error.
export const REFERRAL_PROPERTY_CATEGORIES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land / Plot" },
];

export const REFERRAL_PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "independent_house", label: "Independent House" },
  { value: "villa", label: "Villa" },
  { value: "builder_floor", label: "Builder Floor" },
  { value: "studio", label: "Studio" },
  { value: "1rk", label: "1 RK" },
  { value: "plot", label: "Plot" },
  { value: "shop", label: "Shop" },
  { value: "office", label: "Office" },
  { value: "warehouse", label: "Warehouse" },
];

export const REFERRAL_TYPE_LABELS = {
  signup: "Link Signup",
  friend: "Person Referral",
  property: "Property Referral",
};

export const REFERRAL_STATUSES = [
  "pending",
  "registered",
  "deal_closed",
  "rewarded",
  "expired",
];

export const REFERRAL_TYPES = Object.keys(REFERRAL_TYPE_LABELS);

// Prefilled in the admin reward dialog so amounts are consistent — the admin
// can still change it per referral. Matches what has been paid so far.
export const REWARD_DEFAULTS = {
  signup: 100,
  friend: 100,
  property: 100,
};

// Upper bound on a single reward, so a stray extra zero in the admin dialog
// can't credit a wallet ₹50,00,000.
export const MAX_REWARD_AMOUNT = 50000;

// How long after signing up a user may still enter someone's referral code.
// Without a window, a long-standing member could credit any friend at any time,
// and two members could swap codes to both collect a reward.
export const ATTACH_WINDOW_DAYS = 14;

export const MIN_WITHDRAWAL_AMOUNT = 100;

export const WITHDRAWAL_STATUS_LABELS = {
  pending: "Processing",
  paid: "Paid",
  rejected: "Rejected",
};

const VALID_PURPOSES = REFERRAL_PURPOSES.map((p) => p.value);
const VALID_CATEGORIES = MEDIA_CATEGORIES.map((c) => c.value);
const VALID_PROPERTY_CATEGORIES = REFERRAL_PROPERTY_CATEGORIES.map((c) => c.value);
const VALID_PROPERTY_TYPES = REFERRAL_PROPERTY_TYPES.map((t) => t.value);

export const isValidPurpose = (v) => VALID_PURPOSES.includes(v);
export const isValidMediaCategory = (v) => VALID_CATEGORIES.includes(v);
export const isValidPropertyCategory = (v) => VALID_PROPERTY_CATEGORIES.includes(v);
export const isValidPropertyType = (v) => VALID_PROPERTY_TYPES.includes(v);
export const isValidReferralStatus = (v) => REFERRAL_STATUSES.includes(v);
export const isValidReferralType = (v) => REFERRAL_TYPES.includes(v);

/** Uppercases and strips anything that can't be part of a code. */
export function normalizeCode(input) {
  return String(input ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

/**
 * Numbers arrive as "+91 98765 43210", "098765 43210", "9876543210" — reduce
 * them to the bare 10-digit form so duplicate checks and user lookups match.
 */
export function normalizePhone(input) {
  const digits = String(input ?? "").replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) return digits.slice(-10);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function isValidPhone(digits) {
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * "9876543210" -> "98•••••210". A link signup's phone number is the new
 * member's own — the referrer may have posted the link in a group and never
 * had it, so they only get enough to recognise who joined.
 */
export function maskPhone(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "").slice(-10);
  if (digits.length < 10) return digits ? "•".repeat(digits.length) : "";
  return `${digits.slice(0, 2)}•••••${digits.slice(-3)}`;
}

/**
 * The link a user shares. It opens the WhatsApp OTP form directly — that form
 * is the signup page too (new numbers get an account on verification) — so an
 * invitee isn't left on the home page hunting for a sign-up button.
 */
export function referralLink(code) {
  return `${SITE_URL}/auth/login?ref=${code}`;
}

// Only the referrer is rewarded, so the message must not promise the invitee
// anything.
export function referralShareMessage(code, referrerName) {
  const from = referrerName ? `${referrerName} here. ` : "";
  return [
    `${from}I use DCDH Empire for zero-brokerage property search.`,
    "",
    "Sign up with my link:",
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

/** Clipboard writes fail on insecure origins and some in-app browsers. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
