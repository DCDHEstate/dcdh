import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { generateOTP, hashOTP, sendWhatsAppOTP } from "@/lib/otp";

const RATE_LIMIT_MAX = 10; // TODO: consider lowering to 3 after testing
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    // Strip non-digits, validate Indian mobile: 10 digits starting with 6-9
    const cleaned = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit Indian mobile number" },
        { status: 400 },
      );
    }

    // Rate limit: max 3 OTP requests per phone per 10 minutes
    // INTERVAL literal cannot be parameterized in postgres.js — hardcoded intentionally
    const recentCount = await sql`
      SELECT COUNT(*) AS cnt
      FROM otp_verifications
      WHERE phone = ${cleaned}
        AND created_at > NOW() - INTERVAL '10 minutes'
    `;

    if (parseInt(recentCount[0].cnt, 10) >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        {
          error:
            "Too many OTP requests. Please wait 10 minutes before trying again.",
        },
        { status: 429 },
      );
    }

    // Invalidate any previous unused OTPs for this phone
    await sql`
      UPDATE otp_verifications
      SET is_used = TRUE
      WHERE phone = ${cleaned}
        AND is_used = FALSE
        AND expires_at > NOW()
    `;

    // Generate, hash, and store new OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await sql`
      INSERT INTO otp_verifications (phone, otp_hash, expires_at)
      VALUES (${cleaned}, ${otpHash}, ${expiresAt})
    `;

    // Send via WhatsApp (TODO: wire up GetGabs)
    const { success } = await sendWhatsAppOTP(cleaned, otp);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to send OTP. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "OTP sent successfully", phone: cleaned },
      { status: 200 },
    );
  } catch (err) {
    console.error("[send-otp]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
