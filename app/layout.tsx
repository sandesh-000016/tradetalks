import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://tradetalks.in"),

  title: {
    default: "Trade Talks | Learn Stock Market Trading in Kerala",
    template: "%s | Trade Talks",
  },

  description:
    "Learn Stock Market Trading the right way with Trade Talks. Professional online and offline trading courses in Angamaly and Kozhikode. Master technical analysis, price action, risk management, and become a confident trader.",

  keywords: [
    "Trade Talks",
    "Stock Market Course",
    "Trading Classes Kerala",
    "Stock Market Training",
    "Learn Trading",
    "Technical Analysis",
    "Price Action",
    "Intraday Trading",
    "Swing Trading",
    "Options Trading",
    "Trading Course Kerala",
    "Trading Classes Angamaly",
    "Trading Classes Kozhikode",
    "Online Trading Course",
    "Offline Trading Course",
    "Stock Market Education",
    "Trading Institute Kerala",
    "Nifty Trading",
    "Bank Nifty",
    "Trading Mentor",
    "Financial Education",
  ],

  authors: [
    {
      name: "Trade Talks",
    },
  ],

  creator: "Trade Talks",

  publisher: "Trade Talks",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://tradetalks.in",
    siteName: "Trade Talks",
    title: "Trade Talks | Learn Stock Market Trading",
    description:
      "Professional stock market education through online and offline classes in Angamaly and Kozhikode.",
    images: [
      {
        url: "/og-jpg.jpg",
        width: 1200,
        height: 630,
        alt: "Trade Talks",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Trade Talks | Learn Stock Market Trading",
    description:
      "Master the markets with Trade Talks. Online & Offline Stock Market Courses.",
    images: ["/og-jpg.jpg"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  manifest: "/site.webmanifest",

  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50 selection:bg-brand-600 selection:text-white">
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Trade Talks",
              url: "https://tradetalks.in",
              logo: "https://tradetalks.in/logo.png",
              image: "https://tradetalks.in/og-image.jpg",
              description:
                "Professional Stock Market Learning Platform offering online and offline trading courses in Kerala.",
              areaServed: "India",
              address: [
                {
                  "@type": "PostalAddress",
                  addressLocality: "Angamaly",
                  addressRegion: "Kerala",
                  addressCountry: "IN",
                },
                {
                  "@type": "PostalAddress",
                  addressLocality: "Kozhikode",
                  addressRegion: "Kerala",
                  addressCountry: "IN",
                },
              ],
              sameAs: [
                "https://www.instagram.com/tradetalksofficial?igsh=NTRxa3FjNGRjZTUy"
              ],
            }),
          }}
        />

        <div className="min-h-screen flex flex-col relative overflow-hidden">
          {/* Background Glow */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-900/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-950/20 blur-[120px] rounded-full" />
          </div>

          <Navbar />

          <main className="relative z-10 flex-grow">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}