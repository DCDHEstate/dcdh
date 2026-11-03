import Image from "next/image";
import { brochureUrl } from "@/lib/projects";
import { SITE_URL } from "@/lib/whatsapp";

const WHATSAPP_NUMBER = "919257533440";

function enquiryLink(project) {
  const text = [
    `Hi, I'm interested in ${project.name} (${project.eyebrow}).`,
    `${SITE_URL}/projects/${project.slug}`,
    "",
    "Please share more details.",
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function DownloadIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M4 19.5h16" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a47.6 47.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, note }) {
  return (
    <div className="mb-8 max-w-2xl md:mb-10">
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-elegant text-[var(--project-accent-strong)]">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-heading md:text-4xl">{title}</h2>
      {note && <p className="mt-3 text-sm leading-relaxed text-muted">{note}</p>}
    </div>
  );
}

function Hero({ project, primaryBrochure }) {
  return (
    <section className="bg-[var(--project-dark)] pt-24 text-white lg:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 lg:grid-cols-[5fr_6fr] lg:gap-14 lg:px-8 lg:pb-16">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-elegant text-[var(--project-accent)]">{project.eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{project.name}</h1>
          <p className="mt-4 text-xl leading-snug text-white/90 md:text-2xl">{project.tagline}</p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 md:text-base">{project.summary}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={brochureUrl(primaryBrochure.file)}
              download
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--project-accent)] px-6 py-3.5 text-sm font-semibold text-[var(--project-dark)] transition-opacity hover:opacity-90"
            >
              <DownloadIcon /> Download brochure
            </a>
            <a
              href={enquiryLink(project)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Enquire on WhatsApp
            </a>
          </div>

          {project.rera && (
            <p className="mt-5 text-xs leading-relaxed text-white/60">
              {project.rera.label}: {project.rera.numbers.join(" · ")}
            </p>
          )}
        </div>

        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
          <Image
            src={project.hero.src}
            alt={project.hero.alt}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Facts({ facts }) {
  return (
    <section className="border-b border-border-light bg-surface-white">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-6 px-4 py-8 md:grid-cols-4 lg:px-8">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dd className="text-xl font-semibold text-heading md:text-2xl">{fact.value}</dd>
            <dt className="mt-1 text-xs leading-snug text-muted md:text-sm">{fact.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Overview({ project }) {
  return (
    <section className="bg-surface py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-heading md:text-4xl">{project.overviewTitle}</h2>
          {project.overview.map((paragraph) => (
            <p key={paragraph} className="mt-5 leading-relaxed text-body">{paragraph}</p>
          ))}
          <p className="mt-5 text-sm text-muted">Developer: {project.developer}</p>
        </div>
        {project.highlights && (
          <ul className="divide-y divide-border-light self-center border-y border-border-light">
            {project.highlights.map((item) => (
              <li key={item.title} className="py-5">
                <h3 className="font-semibold text-heading">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Gallery({ images }) {
  return (
    <section className="bg-surface-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="A closer look" note="Artist's impressions from the developer's brochure." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {images.map((image, i) => (
            <figure key={image.src} className={i === 0 ? "col-span-2 flex flex-col md:row-span-2" : ""}>
              <div className={`relative overflow-hidden rounded-xl bg-surface-subtle ${i === 0 ? "aspect-[3/2] md:aspect-auto md:flex-1" : "aspect-[3/2]"}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-xs text-muted md:text-sm">{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Amenities({ title, items }) {
  return (
    <section className="bg-[var(--project-tint)] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title={title} />
        <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4">
          {items.map((item) => (
            <li key={item} className="border-t border-black/10 pt-3 text-sm text-body">{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Suite({ suite }) {
  return (
    <section className="bg-[var(--project-tint)] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title={suite.title} />
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
          <div>
            <div className="relative mx-auto aspect-[338/620] max-w-xs overflow-hidden rounded-xl bg-surface-white">
              <Image src={suite.plan.src} alt={suite.plan.alt} fill sizes="320px" className="object-contain" />
            </div>
            <dl className="mx-auto mt-5 max-w-xs text-sm">
              {suite.areas.map((area) => (
                <div key={area.label} className="flex justify-between gap-4 border-t border-black/10 py-2">
                  <dt className="text-muted">{area.label}</dt>
                  <dd className="font-medium text-heading">{area.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <div className="grid grid-cols-3 gap-3">
              {suite.images.map((image) => (
                <div key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 22vw, 33vw" className="object-cover" />
                </div>
              ))}
            </div>
            <h3 className="mb-4 mt-8 font-semibold text-heading">Included in the suite</h3>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-body sm:grid-cols-2">
              {suite.inclusions.map((item) => (
                <li key={item} className="border-t border-black/10 pt-2">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Plans({ plans }) {
  return (
    <section className="bg-surface-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <SectionHeading title={plans.title} />
        <div className="relative aspect-[936/648] overflow-hidden rounded-xl border border-border-light">
          <Image src={plans.image.src} alt={plans.image.alt} fill sizes="(min-width: 1024px) 960px, 100vw" className="object-contain" />
        </div>
      </div>
    </section>
  );
}

function SubProjects({ data }) {
  return (
    <section className="bg-[var(--project-tint)] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title={data.title} note={data.note} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => (
            <article key={item.name} className="overflow-hidden rounded-2xl bg-surface-white shadow-soft">
              <div className="relative aspect-[3/2]">
                <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-xs font-medium text-[var(--project-accent-strong)]">{item.type}</p>
                <h3 className="mt-1 text-lg font-semibold text-heading">{item.name}</h3>
                <p className="mt-2 text-lg font-semibold text-heading">{item.price}</p>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {item.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Parcels({ data }) {
  const columns = [
    ["village", "Village"], ["survey", "New survey no."], ["tp", "Sub TP"],
    ["zone", "Zone"], ["area", "Area (sq. yard)"], ["road", "TP road"],
  ];
  return (
    <section className="bg-surface-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title={data.title} note={data.note} />
        <div className="overflow-x-auto rounded-xl border border-border-light">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[var(--project-tint)] text-heading">
              <tr>
                {columns.map(([key, label]) => <th key={key} scope="col" className="px-4 py-3 font-semibold">{label}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-body">
              {data.rows.map((row) => (
                <tr key={row.survey}>
                  {columns.map(([key]) => <td key={key} className="px-4 py-3">{row[key]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Context({ context }) {
  return (
    <section className="bg-surface py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
          <Image src={context.image.src} alt={context.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-elegant text-[var(--project-accent-strong)]">{context.eyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-heading md:text-4xl">{context.title}</h2>
          <p className="mt-4 leading-relaxed text-body">{context.text}</p>
          <ul className="mt-5 divide-y divide-border-light border-y border-border-light text-sm text-body">
            {context.points.map((point) => <li key={point} className="py-3">{point}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Location({ location }) {
  return (
    <section className="bg-surface py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[3fr_2fr] lg:gap-12 lg:px-8">
        <div className="relative aspect-[990/610] overflow-hidden rounded-2xl border border-border-light">
          <Image src={location.map.src} alt={location.map.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-heading md:text-4xl">{location.title}</h2>
          <p className="mt-3 text-sm text-muted">{location.address}</p>
          <div className="mt-6 space-y-4">
            {location.groups.map((group) => (
              <div key={group.label} className="border-t border-border-light pt-3">
                <h3 className="text-sm font-semibold text-heading">{group.label}</h3>
                <ul className="mt-1 space-y-0.5 text-sm text-body">
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Terms({ terms }) {
  return (
    <section className="bg-[var(--project-tint)] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title={terms.title} />
        <ol className="grid gap-4 sm:grid-cols-3">
          {terms.steps.map((step) => (
            <li key={step.title} className="rounded-xl bg-surface-white p-5">
              <p className="text-2xl font-semibold text-heading">{step.title}</p>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-body">{terms.note}</p>
      </div>
    </section>
  );
}

function BrochureBlock({ project }) {
  return (
    <section id="brochure" className="bg-[var(--project-dark)] py-14 text-white md:py-20">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Get the full brochure</h2>
        <p className="mt-3 text-white/70">Free to download, no sign-up needed. Or message us and we&apos;ll help you with availability and current pricing.</p>
        <ul className="mt-8 space-y-3">
          {project.brochures.map((brochure) => (
            <li key={brochure.file}>
              <a
                href={brochureUrl(brochure.file)}
                download
                className="flex items-center justify-between gap-4 rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/15"
              >
                <span>
                  <span className="block font-medium">{brochure.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-white/60">PDF · {brochure.detail}</span>
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--project-accent)] text-[var(--project-dark)]">
                  <DownloadIcon className="h-5 w-5" />
                  <span className="sr-only">Download</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href={enquiryLink(project)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline-offset-4 hover:underline"
        >
          <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Enquire on WhatsApp
        </a>
      </div>
    </section>
  );
}

function Disclaimer({ project }) {
  return (
    <section className="bg-surface-subtle py-8">
      <div className="mx-auto max-w-7xl space-y-2 px-4 text-xs leading-relaxed text-muted lg:px-8">
        {project.rera && (
          <p>
            {project.rera.label} registration as printed in the developer&apos;s brochure: {project.rera.numbers.join(", ")}. Verify at{" "}
            <a href={project.rera.url} target="_blank" rel="noopener noreferrer" className="underline">{project.rera.url.replace("https://", "")}</a>.
          </p>
        )}
        <p>{project.disclaimer}</p>
        <p>Details on this page are taken from the developer&apos;s brochure. DCDH Empire is not the developer of this project. Please verify all information before making a purchase decision.</p>
      </div>
    </section>
  );
}

// Thumb-reach actions on phones, where the hero buttons scroll away quickly.
function MobileActions({ project, primaryBrochure }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-border-light bg-surface-white p-3 lg:hidden">
      <a
        href={brochureUrl(primaryBrochure.file)}
        download
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--project-dark)] px-3 py-3 text-sm font-semibold text-white"
      >
        <DownloadIcon /> Brochure
      </a>
      <a
        href={enquiryLink(project)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-medium text-heading"
      >
        <WhatsAppIcon /> WhatsApp
      </a>
    </div>
  );
}

export default function ProjectLanding({ project }) {
  const primaryBrochure = project.brochures.find((b) => b.primary);

  return (
    <main className={`project-theme-${project.theme} pb-[72px] lg:pb-0`}>
      <Hero project={project} primaryBrochure={primaryBrochure} />
      <Facts facts={project.facts} />
      <Overview project={project} />
      {project.gallery && <Gallery images={project.gallery} />}
      {project.subProjects && <SubProjects data={project.subProjects} />}
      {project.parcels && <Parcels data={project.parcels} />}
      {project.terms && <Terms terms={project.terms} />}
      {project.amenities && <Amenities title={project.amenitiesTitle} items={project.amenities} />}
      {project.suite && <Suite suite={project.suite} />}
      {project.plans && <Plans plans={project.plans} />}
      {project.location && <Location location={project.location} />}
      {project.context && <Context context={project.context} />}
      <BrochureBlock project={project} />
      <Disclaimer project={project} />
      <MobileActions project={project} primaryBrochure={primaryBrochure} />
    </main>
  );
}
