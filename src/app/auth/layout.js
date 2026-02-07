import Link from "next/link";

export const metadata = {
  title: "Sign In",
  description: "Sign in to DCDH Estate to access your personalized real estate experience.",
};

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Minimal Header for Auth Pages */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border-light bg-surface-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <span className="text-sm font-bold text-white">D</span>
              <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
            </div>
            <span className="text-lg font-semibold text-heading">
              DCDH <span className="text-accent">Estate</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted transition-colors hover:text-heading"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-6 pb-12 pt-24">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border-light bg-surface-white py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} DCDH Estate. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted hover:text-heading">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted hover:text-heading">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
