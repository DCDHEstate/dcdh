import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import FooterWrapper from "@/components/FooterWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL("https://dcdhempire.com"),
  title: {
    default:
      "DCDH Empire - Zero Brokerage Real Estate Platform in Jaipur | Buy, Rent & Refer Properties",
    template: "%s | DCDH Empire",
  },
  description:
    "Find verified properties in Jaipur with zero brokerage. DCDH Empire offers transparent real estate services for tenants, owners & partners. WhatsApp-first experience with verified listings.",
  keywords: [
    "real estate Jaipur",
    "property in Jaipur",
    "rent house Jaipur",
    "buy property Jaipur",
    "zero brokerage",
    "verified properties",
    "DCDH Empire",
    "flat for rent Jaipur",
    "commercial property Jaipur",
    "residential property Jaipur",
    "property listing",
    "tenant portal",
    "owner portal",
    "WhatsApp real estate",
  ],
  authors: [{ name: "DCDH Empire" }],
  creator: "DCDH Empire",
  publisher: "DCDH Empire",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dcdhempire.com",
    siteName: "DCDH Empire",
    title: "DCDH Empire - Zero Brokerage Real Estate Platform in Jaipur",
    description:
      "Find verified properties in Jaipur with zero brokerage. Transparent real estate for tenants, owners & partners.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DCDH Empire - Real Estate Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DCDH Empire - Zero Brokerage Real Estate in Jaipur",
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
    canonical: "https://dcdhempire.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1c1917" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <FooterWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
