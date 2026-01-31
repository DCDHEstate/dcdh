import Hero from "@/components/home/Hero";
import SearchStrip from "@/components/home/SearchStrip";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import HowItWorks from "@/components/home/HowItWorks";
import Portals from "@/components/home/Portals";
import ReferralProgram from "@/components/home/ReferralProgram";
import UpcomingFeatures from "@/components/home/UpcomingFeatures";
import TrustMetrics from "@/components/home/TrustMetrics";

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "DCDH Estate",
            description:
              "Zero brokerage real estate platform in Jaipur for buying, renting and referring properties with verified listings and WhatsApp-first experience.",
            url: "https://dcdhestate.com",
            logo: "https://dcdhestate.com/logo.png",
            telephone: "+91-83060-34440",
            email: "support@dcdhestate.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Malviya Nagar",
              addressLocality: "Jaipur",
              addressRegion: "Rajasthan",
              postalCode: "302017",
              addressCountry: "IN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "26.8505",
              longitude: "75.8043",
            },
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "09:00",
              closes: "21:00",
            },
            areaServed: {
              "@type": "City",
              name: "Jaipur",
            },
            sameAs: ["https://wa.me/918306034440"],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "500",
            },
          }),
        }}
      />

      {/* Hero Section */}
      <Hero />

      {/* Quick Search Strip */}
      <SearchStrip />

      {/* Featured Properties */}
      <FeaturedProperties />

      {/* How It Works */}
      <HowItWorks />

      {/* Portals Section (Tenant & Owner) */}
      <Portals />

      {/* Referral Program */}
      <ReferralProgram />

      {/* Upcoming Features */}
      <UpcomingFeatures />

      {/* Trust Metrics */}
      <TrustMetrics />
    </>
  );
}
