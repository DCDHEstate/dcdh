"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Step 1: Phone number input ───────────────────────────────────────────────

function PhoneStep({ onOtpSent }) {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleaned = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleaned }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP. Please try again.");
        return;
      }

      onOtpSent(cleaned);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#25d366]/30 bg-[#25d366]/10 px-4 py-1.5">
          <WhatsAppIcon className="h-3.5 w-3.5 text-[#25d366]" />
          <span className="text-xs font-medium tracking-widest text-[#25d366]">
            WHATSAPP OTP
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-heading">
          Sign in to DCDH Estate
        </h1>
        <p className="text-sm text-muted">
          We&apos;ll send a 6-digit OTP to your WhatsApp
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-heading">
            Mobile Number
          </label>
          <div className="flex">
            {/* +91 prefix */}
            <span className="flex items-center gap-1.5 rounded-l-xl border border-r-0 border-border bg-surface-subtle px-4 text-sm text-muted">
              <WhatsAppIcon className="h-4 w-4 text-[#25d366]" />
              +91
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                setError("");
              }}
              placeholder="10-digit mobile number"
              maxLength={10}
              required
              autoFocus
              className="w-full rounded-r-xl border border-border bg-surface-subtle py-3.5 px-4 text-sm text-body placeholder-subtle transition-all duration-300 focus:border-primary focus:bg-surface-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading || phone.length !== 10}
          className="btn-premium flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <WhatsAppIcon className="h-5 w-5" />
              Send OTP on WhatsApp
            </>
          )}
        </button>
      </form>

      {/* Benefits */}
      <div className="mt-8">
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-white px-4 text-subtle">No password needed</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            "Zero brokerage guarantee",
            "Verified listings",
            "WhatsApp-first experience",
            "Referral rewards",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-xs text-muted">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-verified/10">
                <svg
                  className="h-2.5 w-2.5 text-verified"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Step 2: OTP verification ─────────────────────────────────────────────────

function OtpStep({ phone, onBack, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const otpValue = otp.join("");

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpValue.length !== 6) return;
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpValue }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      onSuccess(data.redirectTo);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend OTP.");
        return;
      }

      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(30);
      inputRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Mask phone: show first 2 and last 4 digits
  const maskedPhone = `+91 ${phone.slice(0, 2)}XXXX${phone.slice(-4)}`;

  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#25d366]/30 bg-[#25d366]/10 px-4 py-1.5">
          <WhatsAppIcon className="h-3.5 w-3.5 text-[#25d366]" />
          <span className="text-xs font-medium tracking-widest text-[#25d366]">
            OTP SENT
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-heading">Enter OTP</h1>
        <p className="text-sm text-muted">
          Sent to{" "}
          <span className="font-medium text-body">{maskedPhone}</span>{" "}
          via WhatsApp
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 6-box OTP input */}
        <div>
          <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`h-14 w-12 rounded-xl border text-center text-xl font-semibold text-heading transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  digit
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-surface-subtle"
                }`}
              />
            ))}
          </div>
          {error && (
            <p className="mt-3 text-center text-xs text-red-500">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || otpValue.length !== 6}
          className="btn-premium w-full rounded-xl bg-primary px-8 py-4 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Verifying...
            </span>
          ) : (
            "Verify & Sign In"
          )}
        </button>
      </form>

      {/* Resend & back */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-muted transition-colors hover:text-heading"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Change number
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending}
          className="font-medium text-accent transition-colors hover:text-accent-dark disabled:cursor-not-allowed disabled:text-muted"
        >
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : isResending
              ? "Sending..."
              : "Resend OTP"}
        </button>
      </div>
    </>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");

  const handleOtpSent = (cleanedPhone) => {
    setPhone(cleanedPhone);
    setStep("otp");
  };

  const handleSuccess = (redirectTo) => {
    const redirect = searchParams.get("redirect");
    router.push(redirect || redirectTo);
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-surface-white p-8 shadow-soft">
        {step === "phone" ? (
          <PhoneStep onOtpSent={handleOtpSent} />
        ) : (
          <OtpStep
            phone={phone}
            onBack={() => setStep("phone")}
            onSuccess={handleSuccess}
          />
        )}
      </div>

      {/* Trust badges */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-xs text-subtle">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>256-bit SSL</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-xs text-subtle">
          <WhatsAppIcon className="h-4 w-4 text-[#25d366]" />
          <span>WhatsApp Verified</span>
        </div>
      </div>
    </div>
  );
}
