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
    "Kyrell",
    "kyrell",
    "HAZY",
    "hazy",
    "CS graduate",
    "software developer",
    "Philippines",
    "Bacolod City",
    "Negros Occidental",
    "YouTube Shorts automation",
    "DTI queue system",
    "SentinelView",
    "SpellGate",
    "Polycon",
    "Systems Architect",
    "Full-Stack Engineer",
  ],
  authors: [{ name: "Kyrell Santillan" }],
  metadataBase: new URL("https://hazyfactory.vercel.app/"),
  alternates: {
    canonical: "https://hazyfactory.vercel.app/",
  },
  openGraph: {
    type: "website",
    title: "HAZY",
    description:
      "I build systems the way architects design buildings — failure modes first, elegance second. Government infrastructure, AI automation pipelines, and defensible web applications.",
    url: "https://hazyfactory.vercel.app/",
    siteName: "HAZY · Kyrell Santillan",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "HAZY Circular Mark & Logo",
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
  verification: {
    google: "ZL-rIBLn4dRYbQvp5nrjL1SfCtzVrel-UX-sP3Pl9ME",
  },
};

import { ThemeProvider } from "@/context/ThemeContext";

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
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${syne.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="google-site-verification" content="ZL-rIBLn4dRYbQvp5nrjL1SfCtzVrel-UX-sP3Pl9ME" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("hazy_theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}else if(window.matchMedia("(prefers-color-scheme: light)").matches){document.documentElement.setAttribute("data-theme","light");}else{document.documentElement.setAttribute("data-theme","dark");}}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <ThemeProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
