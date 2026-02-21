import Link from "next/link";

const statusColors = {
  active: "bg-verified/10 text-verified",
  pending_approval: "bg-accent-soft text-accent-muted",
  rejected: "bg-red-50 text-red-600",
  draft: "bg-surface-subtle text-muted",
  archived: "bg-surface-subtle text-muted",
};

const statusLabels = {
  active: "Active",
  pending_approval: "Pending",
  rejected: "Rejected",
  draft: "Draft",
  archived: "Archived",
};

function formatPrice(price) {
  const num = Number(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function PropertyCard({ property, actions }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-surface-white shadow-soft transition-all hover:shadow-elevated">
      {/* Image */}
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[16/10] bg-surface-subtle">
          {property.primary_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={property.primary_image}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                className="h-12 w-12 text-faint"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
          )}
          {property.status && (
            <span
              className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                statusColors[property.status] || statusColors.draft
              }`}
            >
              {statusLabels[property.status] || property.status}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/properties/${property.slug}`}>
          <h3 className="truncate text-sm font-semibold text-heading transition-colors group-hover:text-accent">
            {property.title}
          </h3>
        </Link>
        <p className="mt-0.5 truncate text-xs text-muted">
          {property.locality_name}
          {property.city_name ? `, ${property.city_name}` : ""}
        </p>
        <p className="mt-2 text-lg font-semibold text-heading">
          {formatPrice(property.price)}
          {property.transaction_type === "rent" && (
            <span className="text-xs font-normal text-muted">/mo</span>
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
          {property.bedrooms && (
            <span className="rounded-full bg-surface-subtle px-2 py-0.5">
              {property.bedrooms} BHK
            </span>
          )}
          {property.area_sqft && (
            <span className="rounded-full bg-surface-subtle px-2 py-0.5">
              {property.area_sqft} sq.ft
            </span>
          )}
          {property.furnishing && (
            <span className="rounded-full bg-surface-subtle px-2 py-0.5 capitalize">
              {property.furnishing.replace("_", " ")}
            </span>
          )}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="mt-3 flex gap-2 border-t border-border-light pt-3">
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  action.variant === "danger"
                    ? "text-red-500 hover:bg-red-50"
                    : "text-muted hover:bg-surface-subtle hover:text-heading"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
