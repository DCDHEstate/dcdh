export default function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-white p-5 shadow-soft sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-heading">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-subtle">{subtitle}</p>
          )}
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          {icon}
        </div>
      </div>
    </div>
  );
}
