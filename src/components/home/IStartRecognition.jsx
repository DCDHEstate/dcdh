export default function IStartRecognition() {
  return (
    <section className="relative overflow-hidden bg-surface-white py-16 texture-dots md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="reveal-left">
          <p className="mb-4 text-xs font-medium tracking-elegant text-accent">
            STARTUP RECOGNITION
          </p>
          <h2 className="mb-5 text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            Recognised by{" "}
            <span className="text-[#008996]">iStart Rajasthan</span>
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-muted">
            DCDH Empire is now an officially recognised startup under iStart
            Rajasthan, strengthening our commitment to verified, transparent
            and technology-led real estate services.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Government recognised", "Trusted & verified", "Jaipur built"].map(
              (label) => (
                <div
                  key={label}
                  className="flex min-h-20 items-center justify-center rounded-xl border border-border-light bg-surface px-4 py-3 text-center text-sm font-medium leading-snug text-body shadow-sm"
                >
                  {label}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="reveal-scale">
          <div className="overflow-hidden rounded-2xl border border-[#008996]/20 bg-white shadow-elevated">
            <div
              role="img"
              aria-label="iStart Rajasthan recognised startup certificate for DCDH Empire"
              className="aspect-[3/2] w-full bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/istart.png')" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
