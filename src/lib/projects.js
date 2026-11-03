// Developer projects with a dedicated landing page at /projects/[slug].
// All facts come from each developer's brochure. Prices, offers and registration
// numbers change, so check them against the latest brochure when updating.

const IMG = (slug, name) => `/images/projects/${slug}/${name}.webp`;

const sarayu = (name) => IMG("the-sarayu-ayodhya", name);
const cruise = (name) => IMG("the-cruise-jaipur", name);
const nestoria = (name) => IMG("nestoria-dholera", name);

export const PROJECTS = [
  {
    slug: "the-sarayu-ayodhya",
    theme: "sarayu",
    card: { type: "Land", highlight: "Riverfront plots" },
    name: "The Sarayu",
    eyebrow: "Ayodhya, Uttar Pradesh",
    tagline: "A riverfront land development on the banks of the Sarayu",
    summary:
      "Plotted land by The House of Abhinandan Lodha, with a clubhouse managed by The Leela Palaces, Hotels and Resorts.",
    developer: "HOABL Realtech Private Limited (The House of Abhinandan Lodha®)",
    rera: {
      label: "UP RERA",
      numbers: ["UPRERAPRJ397318/10/2024", "UPRERAPRJ774489/07/2024"],
      url: "https://www.up-rera.in",
    },
    hero: { src: sarayu("clubhouse-night"), alt: "The Sarayu clubhouse at dusk with its illuminated pool" },
    facts: [
      { value: "15 min", label: "to Ram Mandir" },
      { value: "20 min", label: "to Ayodhya Dham station" },
      { value: "30 min", label: "to the international airport" },
      { value: "30,000+ sq.ft", label: "clubhouse" },
    ],
    overviewTitle: "Land by the river, minutes from the Mandir",
    overview: [
      "The Sarayu is a riverfront enclave off National Highway 27, among the few premium developments overlooking the Sarayu River. Hanuman Garhi, Kanak Bhavan and Dashrath Mahal are all within 15 minutes.",
      "At its centre is a clubhouse of over 30,000 sq.ft with 40+ amenities, managed by The Leela, which is also the hospitality partner for a planned luxury hotel in Ayodhya.",
    ],
    highlights: [
      { title: "On the Sarayu riverfront", text: "A setting with landscaped lawns, gardens and an amphitheatre facing the river." },
      { title: "The Leela as hospitality partner", text: "The clubhouse is managed by The Leela Palaces, Hotels and Resorts." },
      { title: "An owner community", text: "The developer reports 300+ families from 60+ cities and 15+ countries." },
    ],
    gallery: [
      { src: sarayu("riverfront"), alt: "Landscaped gardens facing the Sarayu River", caption: "Riverfront gardens" },
      { src: sarayu("infinity-pool"), alt: "Outdoor pool at sunset", caption: "Outdoor pool" },
      { src: sarayu("clubhouse-reception"), alt: "Double-height clubhouse reception", caption: "Clubhouse reception" },
      { src: sarayu("entrance"), alt: "Grand entrance with water feature", caption: "Grand entrance" },
      { src: sarayu("luxury-suite"), alt: "Luxury suite with king bed", caption: "Luxury suite" },
      { src: sarayu("wedding-lawn"), alt: "Wedding lawn at dusk", caption: "Wedding lawn" },
      { src: sarayu("indoor-pool"), alt: "Indoor pool with sky ceiling", caption: "Indoor pool" },
      { src: sarayu("fine-dining"), alt: "Fine dining restaurant", caption: "Fine dining" },
      { src: sarayu("spa"), alt: "Luxury spa room", caption: "Spa" },
    ],
    amenitiesTitle: "Life at the clubhouse",
    amenities: [
      "Clubhouse pavilion", "Amphitheatre arena", "Open-air gallery", "Wedding lawn",
      "Outdoor pool", "Indoor pool", "Fine dining restaurant", "Fitness gymnasium",
      "Luxury spa", "Luxury suites", "Archery arena", "Pickleball court",
      "Kids' play area", "Indoor games room", "Open-air theatre", "Grand entrance",
    ],
    context: {
      eyebrow: "The location",
      title: "Why Ayodhya",
      image: { src: sarayu("ram-mandir-city"), alt: "Artist's impression of the Ram Mandir and surrounding city" },
      text: "Since the Ram Mandir consecration in January 2024, Ayodhya has seen major public investment in connectivity and visitor infrastructure.",
      points: [
        "Maharishi Valmiki International Airport",
        "Redeveloped Ayodhya Dham Junction railway station",
        "Ram Path, Bhakti Path and Dharma Path corridors",
        "Riverfront beautification under Master Plan 2031",
      ],
    },
    brochures: [
      { file: "the-sarayu-ayodhya-brochure.pdf", label: "Project brochure", detail: "30 pages · 5.2 MB", primary: true },
      { file: "the-sarayu-ayodhya-possession-update.pdf", label: "Possession update (Aug 2026)", detail: "15 pages · 1.6 MB. Prices and offer dates inside may have changed." },
    ],
    disclaimer:
      "‘House of Abhinandan Lodha’ was established in 2020 and is not, in any manner, associated with ‘Lodha’ or ‘Lodha Group’. Images are artist's impressions or for representation only. Clubhouse and amenities are shared with purchasers of other phases of the larger layout. Infrastructure projects are proposed by government authorities and are subject to their approvals and timelines. Distances are indicative.",
  },
  {
    slug: "the-cruise-jaipur",
    theme: "cruise",
    card: { type: "Suites", highlight: "Fully furnished" },
    name: "The Cruise",
    eyebrow: "Jagatpura, Jaipur",
    tagline: "Fully furnished suites in a tower shaped like a luxury liner",
    summary:
      "Cruise-inspired suites by Tanishk Housing Development, presented by Golden Globe, near Bombay Hospital in Jagatpura.",
    developer: "Tanishk Housing Development, presented by Golden Globe",
    rera: {
      label: "Rajasthan RERA",
      numbers: ["RAJ/P/2025/3743"],
      url: "https://rera.rajasthan.gov.in",
    },
    hero: { src: cruise("hero"), alt: "The Cruise tower rising from ocean waves in the brochure artwork" },
    facts: [
      { value: "447.46 sq.ft", label: "suite super built-up (S-21)" },
      { value: "30", label: "furnishing inclusions" },
      { value: "4 min", label: "to Jeevan Rekha Hospital" },
      { value: "20 min", label: "to Jaipur Airport" },
    ],
    overviewTitle: "From entrance to exit, it flows like a liner",
    overview: [
      "The Cruise carries one idea through the whole building: a grand lobby designed like a cruise terminal, suites modelled on premium cabins, and a rooftop that works like a ship's deck.",
      "Suites come fully furnished with interiors, appliances and soft furnishings, so they are ready to live in or let out.",
    ],
    highlights: [
      { title: "A rooftop deck to gather on", text: "Infinity pool, party deck with a big screen, viewing deck and open-air theatre." },
      { title: "Play on board", text: "A box cricket net with a bowling machine, indoor games, gym and yoga deck." },
      { title: "Fully furnished suites", text: "Modular kitchen, AC, TV, refrigerator, wardrobes, bedding and more included." },
    ],
    gallery: [
      { src: cruise("rooftop-pool"), alt: "Rooftop infinity pool at sunset", caption: "Rooftop infinity pool" },
      { src: cruise("tower"), alt: "The Cruise tower at dusk", caption: "Cruise-inspired architecture" },
      { src: cruise("rooftop-clubhouse"), alt: "Rooftop clubhouse shaped like a ship's bow", caption: "Rooftop clubhouse" },
      { src: cruise("terrace-aerial"), alt: "Aerial view of the terrace with sports court", caption: "Terrace from above" },
      { src: cruise("grand-lobby"), alt: "Covered drop-off at the entrance", caption: "Luxury entrance" },
      { src: cruise("viewing-deck"), alt: "Rooftop viewing deck", caption: "Viewing deck" },
      { src: cruise("yoga-deck"), alt: "Yoga deck at sunrise", caption: "Yoga deck" },
      { src: cruise("gymnasium"), alt: "Gymnasium", caption: "Gymnasium" },
      { src: cruise("box-cricket"), alt: "Box cricket net", caption: "Box cricket net" },
    ],
    suite: {
      title: "Inside a suite",
      plan: { src: cruise("suite-plan"), alt: "Floor plan of suite S-21" },
      areas: [
        { label: "Unit", value: "S-21 (Type-2B)" },
        { label: "Built-up area", value: "298.31 sq.ft" },
        { label: "Super built-up area", value: "447.46 sq.ft" },
      ],
      images: [
        { src: cruise("suite-bedroom"), alt: "Furnished suite bedroom" },
        { src: cruise("suite-living"), alt: "Suite lounge and pantry" },
        { src: cruise("suite-lounge"), alt: "Suite TV wall and wardrobe" },
      ],
      inclusions: [
        "King size bed with side box", "Mattress, bedsheet & pillows", "Lounge with 2-seater sofa", "Wooden wardrobe",
        "Study table with chair", "Dressing corner", "LED TV with cabinet", "Split air-conditioner",
        "Modular kitchen", "Refrigerator", "Induction plate", "Chimney",
        "Water purifier", "Coffee maker", "Toaster", "Crockery set",
        "Geyser", "Ceiling & exhaust fans", "False ceiling", "COB & fancy lights",
      ],
    },
    plans: {
      title: "Floor and terrace plans",
      image: { src: cruise("floor-plans"), alt: "Typical floor plan and terrace floor plan with legend" },
    },
    location: {
      title: "Connected across Jaipur",
      map: { src: cruise("location-map"), alt: "Location map of The Cruise in Jagatpura" },
      address: "Site office: Near Bombay Hospital, Jagatpura, Jaipur",
      groups: [
        { label: "Education", items: ["Gyan Vihar University · 5 min", "Poornima University · 10 min", "JECRC University · 10 min"] },
        { label: "Healthcare", items: ["Jeevan Rekha Hospital · 4 min", "Bombay Hospital · 5 min"] },
        { label: "Leisure", items: ["Jaipur Chaupati · 9 min", "Akshaya Patra Temple · 9 min", "Chokhi Dhani · 15 min"] },
        { label: "Travel", items: ["Jaipur International Airport · 20 min"] },
      ],
    },
    brochures: [
      { file: "the-cruise-jaipur-brochure.pdf", label: "Project brochure", detail: "8 pages · 3.2 MB", primary: true },
    ],
    disclaimer:
      "Brochure images are conceptual. Specifications and details are tentative and may change at the sole discretion of the developer and/or architects. Travel times are indicative.",
  },
  {
    slug: "nestoria-dholera",
    theme: "nestoria",
    card: { type: "Plots & Land", highlight: "From ₹9,999/sq. yd" },
    name: "Nestoria Group",
    eyebrow: "Dholera SIR, Gujarat",
    tagline: "Plots, villas and land parcels in India's greenfield smart city",
    summary:
      "Retail projects and bulk land parcels across Dholera Special Investment Region, from Nestoria Buildcon Pvt Ltd.",
    developer: "Nestoria Buildcon Pvt Ltd, Ahmedabad",
    hero: { src: nestoria("dholera-city"), alt: "Artist's impression of Dholera smart city with its central canal" },
    facts: [
      { value: "5", label: "retail projects featured" },
      { value: "11", label: "bulk land parcels" },
      { value: "₹9,999", label: "per sq. yard, lowest plot price listed" },
      { value: "₹11,000", label: "booking amount" },
    ],
    overviewTitle: "One developer, focused on one city",
    overview: [
      "Nestoria Group describes itself as dedicated to Dholera SIR, with residential plots, furnished villas, commercial land and large multi-purpose parcels across its town planning zones.",
      "Dholera is planned as a greenfield smart city with an international airport, an Ahmedabad–Dholera expressway and a semiconductor cluster, and these projects sit across that master plan.",
    ],
    highlights: [
      { title: "Entry points at different budgets", text: "Plots from 100 sq. yard, furnished 3 BHK villas and large commercial plots." },
      { title: "Land for bulk buyers", text: "Parcels from 1,800 to 44,879 sq. yard across residential, industrial and multi-purpose zones." },
      { title: "Registered with the DSIRDA", text: "The brochure shows a developer registration from the Dholera SIR Development Authority." },
    ],
    subProjects: {
      title: "Retail projects",
      note: "Prices as printed in the developer's 2026 brochure, excluding registry and development charges. Corner and garden-facing plots may cost about 10% extra.",
      items: [
        { name: "Semicon Residency", type: "Residential plots", image: { src: nestoria("semicon-gate"), alt: "Semicon Residency entrance gate" }, price: "₹9,999 / sq. yard", details: ["Village Kanatalav, near TP-5", "Survey No. 120/P1", "Plots from 100 sq. yard (SBA)"] },
        { name: "Nestoria Homes", type: "Residential plots with clubhouse", image: { src: nestoria("homes-aerial"), alt: "Aerial view of Nestoria Homes" }, price: "₹9,999 / sq. yard", details: ["Village Adhelai, near Diamond Circle", "Survey No. 74/P1", "Plots from 156 sq. yard (SBA)"] },
        { name: "Nestoria Atulyam", type: "3 BHK furnished villas", image: { src: nestoria("atulyam-aerial"), alt: "Aerial view of the Nestoria Atulyam villa layout" }, price: "₹98 lakh", details: ["Dhanala, Survey No. 714", "G+1, 1,540 sq.ft construction", "Furniture and appliances included"] },
        { name: "Skyline Imperia", type: "Premium residential plots", image: { src: nestoria("skyline-villa"), alt: "Modern villa at Skyline Imperia" }, price: "₹13,999 / sq. yard", details: ["Village Sodhi, Survey No. 96", "Inside Dholera SIR", "Plots of 1,200 sq. yard (SBA)"] },
        { name: "Emerald Commercial Hub", type: "Multi-purpose commercial plots", image: { src: nestoria("emerald-gate"), alt: "Emerald Commercial Hub entrance" }, price: "₹9,999 / sq. yard", details: ["Village Bhangarh, TP-6, Survey No. 400", "Fronting a 25 m road", "Plots from 1,800 sq. yard (SBA)"] },
      ],
    },
    parcels: {
      title: "Bulk land parcels",
      note: "Available parcels listed in the brochure. Ask us for current availability and pricing.",
      rows: [
        { village: "Aambali", survey: "20 (Old 760)", tp: "1", zone: "Multi-purpose", area: "15,788", road: "55+18 m corner" },
        { village: "Gogla", survey: "7 (Old 290)", tp: "1B", zone: "Multi-purpose", area: "44,879", road: "55+45+18 m corner" },
        { village: "Gogla", survey: "499 (Old 291)", tp: "1B", zone: "Multi-purpose", area: "5,230", road: "55 m" },
        { village: "Bhimtalav", survey: "174 (Old 57/1)", tp: "2B5", zone: "Multi-purpose", area: "4,840 (part)", road: "18 m" },
        { village: "Sangasar", survey: "476 (Old 94)", tp: "3", zone: "High access corridor", area: "1,800 (part)", road: "18 m" },
        { village: "Sodhi", survey: "910 (Old 18P)", tp: "3C", zone: "Residential", area: "9,183", road: "48 m" },
        { village: "Mundi", survey: "351 (Old 248P)", tp: "4A", zone: "Industrial", area: "6,050 (part)", road: "20 m" },
        { village: "Sangasar", survey: "335 (Old 72P)", tp: "5", zone: "High access corridor", area: "4,840", road: "70 m" },
        { village: "Hebatpur", survey: "917 (Old 271/2/12)", tp: "5", zone: "Residential", area: "10,000 (part)", road: "55 m" },
        { village: "Bhangadh", survey: "502 (Old 321)", tp: "6B", zone: "Multi-purpose", area: "8,290", road: "18+18 m corner" },
        { village: "Bhangadh", survey: "513 (Old 335)", tp: "6B", zone: "Multi-purpose", area: "5,865", road: "25+25 m corner" },
      ],
    },
    context: {
      eyebrow: "The location",
      title: "Why Dholera",
      image: { src: nestoria("tata-semiconductor"), alt: "Rendering of the Tata semiconductor plant at Dholera" },
      text: "Dholera SIR is a 920 sq. km planned region in Gujarat, built around plug-and-play infrastructure with utilities laid underground.",
      points: [
        "Tata semiconductor plant within the region",
        "Dholera International Airport under development",
        "Ahmedabad–Dholera expressway",
        "Solar, water treatment and road infrastructure",
      ],
    },
    terms: {
      title: "How booking works",
      steps: [
        { title: "₹11,000", text: "booking amount" },
        { title: "25%", text: "payment within 7 days" },
        { title: "100%", text: "full payment within 30 days" },
      ],
      note: "Registry expenses are extra. On plotted projects, development charges of roughly ₹2,000–3,000 per sq. yard are also extra and payable separately, as set out per project in the brochure.",
    },
    brochures: [
      { file: "nestoria-dholera-brochure.pdf", label: "Projects & land deals 2026", detail: "36 pages · 12.6 MB", primary: true },
    ],
    disclaimer:
      "Prices, plot sizes and availability are as stated in the developer's 2026 brochure and may have changed. Title, N.A. and N.O.C. status are as stated by the developer and should be verified, along with RERA registration for each project, before booking. Images are artist's impressions. Infrastructure projects are subject to government timelines.",
  },
];

export function getProject(slug) {
  return PROJECTS.find((project) => project.slug === slug) ?? null;
}

// Served through /brochures/[file], which redirects to a short-lived signed S3 link.
export function brochureUrl(file) {
  return `/brochures/${file}`;
}
