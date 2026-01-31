import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://dcdhestate.com"),
  title: {
    default: "DCDH Estate - Zero Brokerage Real Estate Platform in Jaipur | Buy, Rent & Refer Properties",
    template: "%s | DCDH Estate",
  },
  description:
    "Find verified properties in Jaipur with zero brokerage. DCDH Estate offers transparent real estate services for tenants, owners & partners. WhatsApp-first experience with verified listings.",
  keywords: [
    "real estate Jaipur",
    "property in Jaipur",
    "rent house Jaipur",
    "buy property Jaipur",
    "zero brokerage",
    "verified properties",
    "DCDH Estate",
    "flat for rent Jaipur",
    "commercial property Jaipur",
    "residential property Jaipur",
    "property listing",
    "tenant portal",
    "owner portal",
    "WhatsApp real estate",
  ],
  authors: [{ name: "DCDH Estate" }],
  creator: "DCDH Estate",
  publisher: "DCDH Estate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dcdhestate.com",
    siteName: "DCDH Estate",
    title: "DCDH Estate - Zero Brokerage Real Estate Platform in Jaipur",
    description:
      "Find verified properties in Jaipur with zero brokerage. Transparent real estate for tenants, owners & partners.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DCDH Estate - Real Estate Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DCDH Estate - Zero Brokerage Real Estate in Jaipur",
    description:
      "Find verified properties with zero brokerage. WhatsApp-first real estate experience.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://dcdhestate.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d9488" />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
