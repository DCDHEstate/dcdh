import crypto from "crypto";

const OTP_LENGTH = 6;

/**
 * Returns a cryptographically random 6-digit string, zero-padded.
 * e.g. "042891"
 * Uses crypto.randomBytes to avoid Math.random() bias.
 */
export function generateOTP() {
  const buffer = crypto.randomBytes(4);
  const num = buffer.readUInt32BE(0);
  return String(num % 1_000_000).padStart(OTP_LENGTH, "0");
}

/**
 * Creates an HMAC-SHA256 hex digest of the OTP using OTP_SECRET.
 * Stored in otp_verifications.otp_hash.
 *
 * Using HMAC (not bcrypt) because:
 * - OTPs are short-lived (10 min) and attempt-limited (5 tries)
 * - HMAC with a server secret makes the hash useless without OTP_SECRET
 * - bcrypt's slowness does not add meaningful security for 6-digit codes
 */
export function hashOTP(otp) {
  const secret = process.env.OTP_SECRET;
  if (!secret) throw new Error("OTP_SECRET environment variable is not set");
  return crypto.createHmac("sha256", secret).update(otp).digest("hex");
}

/**
 * Timing-safe comparison of a submitted OTP against a stored HMAC hash.
 * Uses crypto.timingSafeEqual to prevent timing attacks.
 */
export function verifyOTP(otp, storedHash) {
  const hash = hashOTP(otp);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(storedHash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Sends the OTP to the given phone number via WhatsApp using the GetGabs API.
 * Required env vars: GETGABS_API_KEY, GETGABS_SENDER, GETGABS_CAMPAIGN_ID
 *
 * Template name: primary_auth
 * The OTP is passed in both the BODY and the URL button parameter (index 0).
 */
export async function sendWhatsAppOTP(phone, otp) {
  const apiKey = process.env.GETGABS_API_KEY;
  const sender = process.env.GETGABS_SENDER;
  const campaignId = process.env.GETGABS_CAMPAIGN_ID;

  if (!apiKey || !sender) {
    throw new Error(
      "Missing GetGabs env vars: GETGABS_API_KEY, GETGABS_SENDER, GETGABS_CAMPAIGN_ID",
    );
  }

  // GetGabs expects the number with country code, no +
  const recipient = `91${phone}`;

  const payload = {
    api_key: apiKey,
    sender,
    campaign_id: campaignId,
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipient,
    type: "template",
    template: {
      name: "primary_auth",
      language: { code: "en_US" },
      components: [
        {
          type: "BODY",
          parameters: [{ type: "text", text: otp }],
        },
        {
          type: "button",
          sub_type: "URL",
          index: 0,
          parameters: [{ type: "text", text: otp }],
        },
      ],
    },
  };

  const response = await fetch(
    "https://app.getgabs.com/whatsappbusiness/send-templated-message",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  // Read raw text first — GetGabs may return HTML on errors, not JSON
  const rawText = await response.text();
  console.log(`[GetGabs] Status: ${response.status} | Raw response: ${rawText}`);

  if (!response.ok) {
    console.error(`[GetGabs] API error ${response.status}:`, rawText);
    return { success: false };
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error('[GetGabs] Response was not JSON:', rawText);
    return { success: false };
  }

  return { success: true, messageId: data?.message_id ?? null };
}
