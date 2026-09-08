import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import sql from "@/lib/db";
import { getSession } from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import PropertyGallery from "@/components/PropertyGallery";
import SavePropertyButton from "@/components/SavePropertyButton";
import {
  AMENITY_LABELS,
  formatPrice,
  groupFurnishings,
  toArray,
} from "@/lib/propertyOptions";
import { propertyEnquiryLink } from "@/lib/whatsapp";

// Statuses a listing may be shown under to the general public. Everything else
// (draft, pending_approval, rejected, archived, inactive) is visible only to
// its owner and to admins.
const PUBLIC_STATUSES = ["active", "sold_out"];

async function getProperty(slug) {
  const [property] = await sql`
    SELECT
      p.*,
      s.name  AS state_name,
      c.name  AS city_name,
      l.name  AS locality_name,
      u.full_name AS owner_name,
      u.phone AS owner_phone,
      u.whatsapp_number
    FROM properties p
    JOIN states    s ON s.id = p.state_id
    JOIN cities    c ON c.id = p.city_id
    JOIN localities l ON l.id = p.locality_id
    JOIN users     u ON u.id = p.owner_id
    WHERE p.slug = ${slug}
  `;

  if (!property) return null;

  const media = await sql`
    SELECT media_url, media_type, is_primary, sort_order
    FROM property_media
    WHERE property_id = ${property.id}
    ORDER BY is_primary DESC, sort_order ASC
  `;

  return { ...property, media };
}

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CheckChip({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1.5 text-xs font-medium text-body">
      <svg
        className="h-3.5 w-3.5 text-verified"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {label}
    </span>
  );
}

function SpecItem({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-medium text-body">{value}</span>
    </div>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await getSession(token) : null;
  const isLoggedIn = !!session;
  const isOwner = session?.id === property.owner_id;
  const isAdmin = session?.role === "admin";

  // Unpublished listings must not be browsable by anyone but their owner/admin.
  if (!PUBLIC_STATUSES.includes(property.status) && !isOwner && !isAdmin) {
    notFound();
  }

  // Owners looking at their own listing shouldn't inflate their view count.
  if (property.status === "active" && !isOwner && !isAdmin) {
    await sql`
      UPDATE properties SET view_count = view_count + 1 WHERE id = ${property.id}
    `;
  }

  const isPendingApproval = property.status === "pending_approval";
  const isDraft = property.status === "draft";
  const isRejected = property.status === "rejected";
  const isSoldOut = property.status === "sold_out";
  const isRent = property.transaction_type === "rent";
  const currency = property.currency || "INR";

  const sortedMedia = [...property.media].sort(
    (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0),
  );

  const whatsappLink = propertyEnquiryLink({
    phone: property.whatsapp_number || property.owner_phone,
    title: property.title,
    cityName: property.city_name,
    localityName: property.locality_name,
    slug,
  });
  const loginLink = `/auth/login?redirect=${encodeURIComponent(`/properties/${slug}`)}`;

  const amenities = toArray(property.amenities);
  const furnishingGroups = groupFurnishings(toArray(property.furnishings));

  // Rent reads better in full figures; sale prices use Cr / L shorthand.
  const headlinePrice = formatPrice(property.price, currency, { compact: !isRent });
  const fullAddress = [
    property.address_line1,
    property.address_line2,
    property.locality_name,
    property.city_name,
    property.state_name,
    property.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-surface px-4 pb-28 pt-24 sm:px-6 lg:pb-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-heading transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/search" className="hover:text-heading transition-colors">
            Properties
          </Link>
          <span>/</span>
          <span className="text-body truncate">{property.title}</span>
        </nav>

        {/* Status banners — only the owner/admin ever reaches these states */}
        {isPendingApproval && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <svg
              className="h-5 w-5 shrink-0 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <span>
              <strong>Under Review</strong> — Your listing is being reviewed by
              the DCDH team and will go live within 24 hours.
            </span>
          </div>
        )}
        {isRejected && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <svg
              className="h-5 w-5 shrink-0 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>
              <strong>Listing Rejected</strong>
              {property.rejection_reason
                ? ` — ${property.rejection_reason}`
                : ". Please contact support."}
            </span>
          </div>
        )}
        {isDraft && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm text-muted">
            <span>
              <strong>Draft</strong> — This listing is not yet published.
            </span>
          </div>
        )}
        {isSoldOut && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm text-body">
            <span>
              <strong>No longer available</strong> — This property has been{" "}
              {isRent ? "rented out" : "sold"}.{" "}
              <Link href="/search" className="text-primary hover:underline">
                Browse similar properties
              </Link>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column — media + details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Photo Gallery */}
            <PropertyGallery media={sortedMedia} title={property.title} />

            {/* Title + price */}
            <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-heading sm:text-2xl">
                    {property.title}
                  </h1>
                  <p className="mt-1 text-sm text-muted">
                    {property.locality_name}, {property.city_name},{" "}
                    {property.state_name}
                    {property.pincode ? ` – ${property.pincode}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-primary">
                    {headlinePrice}
                  </p>
                  {isRent && <p className="text-xs text-muted">/month</p>}
                  {property.price_negotiable && (
                    <span className="mt-1 inline-block rounded-full bg-verified/10 px-2 py-0.5 text-xs font-medium text-verified">
                      Negotiable
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs capitalize text-body">
                  {isRent ? "For Rent" : "For Sale"}
                </span>
                <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs capitalize text-body">
                  {property.property_type === "1rk" ? "1 RK" : property.property_type?.replace("_", " ")}
                </span>
                {property.furnishing && (
                  <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs capitalize text-body">
                    {property.furnishing.replace("_", " ")}
                  </span>
                )}
                {property.possession_status && (
                  <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs text-body">
                    {property.possession_status}
                  </span>
                )}
              </div>

              {property.created_at && (
                <p className="mt-4 border-t border-border-light pt-3 text-xs text-muted">
                  Listed on {formatDate(property.created_at)}
                </p>
              )}
            </div>

            {/* Specs Grid */}
            <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <h2 className="mb-4 text-base font-semibold text-heading">
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                <SpecItem
                  label="Bedrooms"
                  value={property.bedrooms ? `${property.bedrooms} BHK` : null}
                />
                <SpecItem label="Bathrooms" value={property.bathrooms} />
                <SpecItem label="Balconies" value={property.balconies} />
                <SpecItem
                  label="Built-up Area"
                  value={
                    property.area_sqft ? `${property.area_sqft} sq.ft` : null
                  }
                />
                <SpecItem
                  label="Carpet Area"
                  value={
                    property.carpet_area_sqft
                      ? `${property.carpet_area_sqft} sq.ft`
                      : null
                  }
                />
                <SpecItem
                  label="Floor"
                  value={
                    property.floor_number != null
                      ? `${property.floor_number} / ${property.total_floors || "?"}`
                      : null
                  }
                />
                <SpecItem
                  label="Parking"
                  value={
                    property.parking_slots
                      ? `${property.parking_slots} ${property.parking_slots === 1 ? "slot" : "slots"}`
                      : null
                  }
                />
                <SpecItem label="Facing" value={property.facing} />
                <SpecItem label="Age" value={property.age_of_property} />
                <SpecItem
                  label="Available From"
                  value={formatDate(property.available_from)}
                />
              </div>
            </div>

            {/* Pricing breakdown — rent only */}
            {isRent &&
              (property.security_deposit ||
                property.maintenance_charge ||
                property.rent_deposit) && (
                <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
                  <h2 className="mb-4 text-base font-semibold text-heading">
                    Pricing Breakdown
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Monthly Rent</span>
                      <span className="font-medium text-body">
                        {formatPrice(property.price, currency, { compact: false })}
                      </span>
                    </div>
                    {property.maintenance_charge && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Maintenance</span>
                        <span className="font-medium text-body">
                          {formatPrice(property.maintenance_charge, currency, { compact: false })}/mo
                        </span>
                      </div>
                    )}
                    {property.security_deposit && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Security Deposit</span>
                        <span className="font-medium text-body">
                          {formatPrice(property.security_deposit, currency, { compact: false })}
                        </span>
                      </div>
                    )}
                    {property.rent_deposit && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Advance / Token</span>
                        <span className="font-medium text-body">
                          {formatPrice(property.rent_deposit, currency, { compact: false })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Description */}
            {property.description && (
              <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
                <h2 className="mb-3 text-base font-semibold text-heading">
                  About this Property
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-body">
                  {property.description}
                </p>
              </div>
            )}

            {/* Furnishings — what physically stays with the unit */}
            {furnishingGroups.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h2 className="text-base font-semibold text-heading">
                    What&apos;s Included
                  </h2>
                  <span className="text-xs capitalize text-muted">
                    {property.furnishing?.replace("_", " ")}
                  </span>
                </div>
                <div className="space-y-4">
                  {furnishingGroups.map((g) => (
                    <div key={g.group}>
                      <p className="mb-2 text-xs font-medium uppercase tracking-elegant text-subtle">
                        {g.group}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {g.items.map((item) => (
                          <CheckChip key={item.id} label={item.label} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
                <h2 className="mb-4 text-base font-semibold text-heading">
                  Society Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <CheckChip key={a} label={AMENITY_LABELS[a] || a} />
                  ))}
                </div>
              </div>
            )}

            {/* Location — always shown; the maps link is the optional part */}
            <div className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <h2 className="mb-3 text-base font-semibold text-heading">
                Location
              </h2>
              <p className="text-sm leading-relaxed text-body">{fullAddress}</p>
              {property.google_maps_url && (
                <a
                  href={property.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-surface-subtle px-4 py-2.5 text-sm font-medium text-body transition-all hover:border-primary/50 hover:text-primary"
                >
                  <svg
                    className="h-4 w-4 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  View on Google Maps
                </a>
              )}
            </div>
          </div>

          {/* Right column — contact card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-surface-white p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-heading">
                  Contact Owner
                </h2>
                <SavePropertyButton
                  propertyId={property.id}
                  className="h-9 w-9 border border-border bg-surface-subtle text-muted hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                />
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {property.owner_name?.[0]?.toUpperCase() || "O"}
                </div>
                <div>
                  <p className="text-sm font-medium text-heading">
                    {property.owner_name || "Property Owner"}
                  </p>
                  <p className="text-xs text-muted">Listed by Owner</p>
                </div>
              </div>

              {isSoldOut ? (
                <Link
                  href="/search"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-subtle px-6 py-3.5 text-sm font-medium text-body transition-all hover:border-primary/50 hover:text-primary"
                >
                  Browse similar properties
                </Link>
              ) : isLoggedIn ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium flex w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              ) : (
                <Link
                  href={loginLink}
                  className="btn-premium flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login to Enquire
                </Link>
              )}

              <div className="mt-4 rounded-xl border border-border bg-surface-subtle p-3 text-center text-xs text-muted">
                Verified listing · No brokerage
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky action bar — the desktop contact card is off-screen here */}
      {!isSoldOut && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface-white/95 px-4 py-3 shadow-elevated backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-primary">
                {headlinePrice}
                {isRent && (
                  <span className="text-xs font-normal text-muted">/month</span>
                )}
              </p>
              <p className="truncate text-xs text-muted">
                {property.locality_name}, {property.city_name}
              </p>
            </div>
            {isLoggedIn ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#25d366] px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            ) : (
              <Link
                href={loginLink}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90"
              >
                Login to Enquire
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return {};

  // Unpublished listings should not be indexable or previewable.
  if (!PUBLIC_STATUSES.includes(property.status)) {
    return { title: property.title, robots: { index: false, follow: false } };
  }

  const typeLabel =
    property.property_type === "1rk"
      ? "1 RK"
      : property.property_type?.replace("_", " ");
  const description =
    property.description?.slice(0, 155) ||
    `${typeLabel} for ${property.transaction_type} in ${property.locality_name}, ${property.city_name}. Verified listing with zero brokerage on DCDH Empire.`;
  const cover =
    property.media.find((m) => m.is_primary && m.media_type === "image") ||
    property.media.find((m) => m.media_type === "image");

  return {
    title: property.title,
    description,
    alternates: { canonical: `/properties/${slug}` },
    openGraph: {
      type: "article",
      title: property.title,
      description,
      url: `/properties/${slug}`,
      images: cover ? [{ url: cover.media_url }] : undefined,
    },
  };
}
