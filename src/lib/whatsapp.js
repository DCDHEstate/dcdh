// WhatsApp deep-link construction for property enquiries.
// Kept in one place so every enquiry that reaches the team reads the same way.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dcdhempire.com";

export function propertyUrl(slug) {
  return `${SITE_URL}/properties/${slug}`;
}

/**
 * Normalises a stored phone number into the digits-only form wa.me expects.
 * Numbers are stored inconsistently (10-digit local, +91 prefixed, spaced), and
 * wa.me silently fails on anything with punctuation in it.
 */
export function toWhatsAppNumber(phone, defaultCountryCode = "91") {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits) return null;
  // 10 digits means a bare local number; anything longer already carries a code.
  return digits.length <= 10 ? `${defaultCountryCode}${digits}` : digits;
}

/**
 * Builds the prefilled enquiry message. The listing URL is included on its own
 * line so whoever picks up the chat can open the exact property immediately —
 * WhatsApp linkifies it and renders a preview card.
 */
export function propertyEnquiryMessage({ title, cityName, localityName, slug }) {
  const location = [localityName, cityName].filter(Boolean).join(", ");
  return [
    "Hi, I'm interested in this property:",
    "",
    location ? `${title} — ${location}` : title,
    propertyUrl(slug),
    "",
    "Please share more details.",
  ].join("\n");
}

export function propertyEnquiryLink({ phone, title, cityName, localityName, slug }) {
  const number = toWhatsAppNumber(phone);
  const text = encodeURIComponent(
    propertyEnquiryMessage({ title, cityName, localityName, slug }),
  );
  return `https://wa.me/${number}?text=${text}`;
}
