import type { Metadata, Viewport } from "next";
import { Syne, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#07090e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "HAZY",
  description:
    "Portfolio of Kyrell Santillan (HAZY), CS graduate from the Philippines building government infrastructure, automation pipelines, and AI-driven systems.",
  keywords: [
    "Kyrell Santillan",
    "kyrell santillan",
    "HAZY",
    "CS graduate",
    "software developer",
    "Philippines",
    "YouTube Shorts automation",
    "DTI queue system",
    "SentinelView",
    "SpellGate",
    "Polycon",
  ],
  authors: [{ name: "Kyrell Santillan" }],
  metadataBase: new URL("https://hazyfactory.vercel.app/"),
  alternates: {
    canonical: "https://hazyfactory.vercel.app/",
  },
  openGraph: {
    type: "profile",
    title: "HAZY",
    description:
      "I build systems the way architects design buildings — failure modes first, elegance second.",
    url: "https://hazyfactory.vercel.app/",
    siteName: "HAZY · Kyrell Santillan",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "HAZY Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HAZY",
    description:
      "Portfolio of Kyrell Santillan (HAZY), building government infrastructure, automation pipelines, and AI-driven systems.",
    images: ["/logo.png"],
    creator: "@hazy019",
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://hazyfactory.vercel.app/#person",
        name: "Kyrell Santillan",
        additionalName: "HAZY",
        jobTitle: "Software Developer & Systems Architect",
        url: "https://hazyfactory.vercel.app/",
        image: "https://hazyfactory.vercel.app/logo.png",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bacolod City",
          addressRegion: "Negros Occidental",
          addressCountry: "PH",
        },
        sameAs: [
          "https://github.com/Hazy019",
          "https://linkedin.com/in/kyrell-santillan",
        ],
        knowsAbout: [
          "Software Engineering",
          "Full-Stack Development",
          "Python Automation",
          "Cybersecurity",
          "Next.js 15",
          "Django",
          "React 19",
          "AWS Lambda",
          "WebSockets",
        ],
      },
      {
        "@type": "CreativeWork",
        name: "YouTube Shorts Automated Video Pipeline",
        author: { "@id": "https://hazyfactory.vercel.app/#person" },
        description: "Automated video generation pipeline using PyQt6, AWS Lambda, Remotion, and Reddit API.",
        url: "https://github.com/Hazy019/AutoShorts-AI",
      },
      {
        "@type": "CreativeWork",
        name: "DTI Local Queue & Ticket Management System",
        author: { "@id": "https://hazyfactory.vercel.app/#person" },
        description: "Government service queue ticketing system with WebSocket real-time updates and SQLite transaction safety.",
        url: "https://github.com/Hazy019/DTI-Queue-System",
      },
      {
        "@type": "WebSite",
        "@id": "https://hazyfactory.vercel.app/#website",
        url: "https://hazyfactory.vercel.app/",
        name: "Kyrell Santillan (HAZY) Portfolio",
        description:
          "Portfolio of Kyrell Santillan (HAZY), CS graduate from the Philippines building government infrastructure, automation, and thoughtful systems.",
        publisher: {
          "@id": "https://hazyfactory.vercel.app/#person",
        },
      },
    ],
  };

  return (
    <html lang="en" data-theme="dark" className={`${syne.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
