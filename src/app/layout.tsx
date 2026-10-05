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
  title: "Kyrell Santillan (Hazy019) — Software Developer & Systems Architect",
  description:
    "Official portfolio of Kyrell Santillan (Hazy019), CS graduate from STI West Negros University building government infrastructure, automation pipelines, and AI-driven systems.",
  keywords: [
    "Kyrell Santillan",
    "kyrell santillan",
    "Kyrell",
    "kyrell",
    "Hazy019",
    "hazy019",
    "HAZY",
    "hazy",
    "STI West Negros University",
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
    "cosedevs",
  ],
  authors: [{ name: "Kyrell Santillan", url: "https://hazy.cosedevs.com/" }],
  creator: "Kyrell Santillan",
  publisher: "Kyrell Santillan",
  metadataBase: new URL("https://hazy.cosedevs.com/"),
  alternates: {
    canonical: "https://hazy.cosedevs.com/",
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
  openGraph: {
    type: "website",
    title: "Kyrell Santillan (Hazy019) — Software Developer & Systems Architect",
    description:
      "I build systems the way architects design buildings — failure modes first, elegance second. Government infrastructure, AI automation pipelines, and defensible web applications.",
    url: "https://hazy.cosedevs.com/",
    siteName: "Kyrell Santillan (Hazy019) · Portfolio",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Kyrell Santillan (Hazy019) Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyrell Santillan (Hazy019) — Software Developer & Systems Architect",
    description:
      "Official portfolio of Kyrell Santillan (Hazy019), building government infrastructure, automation pipelines, and AI-driven systems.",
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
        "@id": "https://hazy.cosedevs.com/#person",
        name: "Kyrell Santillan",
        alternateName: ["Hazy019", "HAZY", "kyrell santillan", "Kyrell Santillan", "hazy019"],
        jobTitle: "Software Developer & Systems Architect",
        url: "https://hazy.cosedevs.com/",
        image: "https://hazy.cosedevs.com/logo.png",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bacolod City",
          addressRegion: "Negros Occidental",
          addressCountry: "PH",
        },
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "STI West Negros University",
        },
        sameAs: [
          "https://github.com/Hazy019",
          "https://www.linkedin.com/in/kyrell-santillan",
          "https://linkedin.com/in/kyrell-santillan",
          "https://spellgate-eb1e8.web.app",
          "https://www.star-history.com/hazy019",
          "https://www.facebook.com/profile.php?id=61592218332539",
          "https://pyra-keep-alive-web.vercel.app",
          "https://idee-cli.vercel.app",
          "https://shortsautomations.vercel.app",
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
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description: "Automated video generation pipeline using PyQt6, AWS Lambda, Remotion, and Reddit API.",
        url: "https://shortsautomations.vercel.app",
      },
      {
        "@type": "CreativeWork",
        name: "SpellGate Screen-Time Spelling Kiosk",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description: "Educational screen-time management and spelling gamification kiosk platform.",
        url: "https://spellgate-eb1e8.web.app",
      },
      {
        "@type": "CreativeWork",
        name: "DTI Local Queue & Ticket Management System",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description: "Government service queue ticketing system with WebSocket real-time updates and SQLite transaction safety.",
        url: "https://github.com/Hazy019/DTI-Queue-System",
      },
      {
        "@type": "CreativeWork",
        name: "Pyra Keep-Alive Web",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description: "Keep-alive web application using PyQt6, AWS Lambda, Remotion, and Reddit API.",
        url: "https://pyra-keep-alive-web.vercel.app",
      },
      {
        "@type": "CreativeWork",
        name: "Idée CLI",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description: "Command-line interface for idea management using PyQt6, AWS Lambda, Remotion, and Reddit API.",
        url: "https://idee-cli.vercel.app",
      },
      {
        "@type": "WebSite",
        "@id": "https://hazy.cosedevs.com/#website",
        url: "https://hazy.cosedevs.com/",
        name: "Kyrell Santillan (Hazy019) Portfolio",
        description:
          "Kyrell Santillan (Hazy019), CS graduate from STI West Negros University building government infrastructure, automation, and thoughtful systems.",
        publisher: {
          "@id": "https://hazy.cosedevs.com/#person",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://hazy.cosedevs.com/#webpage",
        "url": "https://hazy.cosedevs.com/",
        "name": "Kyrell Santillan (Hazy019) Portfolio",
        "description":
          "Kyrell Santillan (Hazy019), CS graduate from STI West Negros University building government infrastructure, automation, and thoughtful systems.",
        "publisher": {
          "@id": "https://hazy.cosedevs.com/#person",
        },
        "isPartOf": {
          "@id": "https://hazy.cosedevs.com/#website",
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
        {/*
         * SSR Identity Block — Server-rendered rich text for Googlebot.
         *
         * WHY THIS EXISTS:
         * The entire page.tsx is a "use client" component, meaning all content
         * (Hero, Work, About, Contact) renders after JavaScript executes.
         * Googlebot smartphone has a ~5s render budget. If the JS preloader
         * animation runs longer, Googlebot captures an empty DOM and marks the
         * page as "Crawled – currently not indexed" (thin content).
         *
         * This block is injected by the Server Component layout into the initial
         * HTML payload — Googlebot reads it at byte 0, before any JS runs.
         * It is visually hidden from users but semantically indexable.
         */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          <h1>Kyrell Santillan (Hazy019) — Software Developer &amp; Systems Architect</h1>
          <p>
            Kyrell Santillan, also known as Hazy019. Computer Science
            graduate from STI West Negros University in Bacolod City, Negros Occidental,
            Philippines. Specializing in government infrastructure software, AI automation
            pipelines, full-stack web development, and cybersecurity engineering.
          </p>
          <h2>Featured Projects by Kyrell Santillan</h2>
          <ul>
            <li>
              DTI Local Queue &amp; Ticket Management System — Government infrastructure
              real-time WebSocket queue ticketing system built for the Department of Trade
              and Industry of the Philippines.
            </li>
            <li>
              YouTube Shorts Automated Video Pipeline — Fully automated video rendering
              pipeline using PyQt6, AWS Lambda, Remotion, and Reddit API integration.
            </li>
            <li>
              Polycon — Consultation &amp; Learning Management System — Full-stack LMS
              with real-time consultation scheduling and AI-powered session transcription
              via AssemblyAI.
            </li>
            <li>
              SpellGate — Screen-Time Access Control Kiosk — Walk-up kiosk system gating
              non-technical user access behind a real-time spell-check validation layer.
            </li>
            <li>
              IDEE-CLI — Developer Architecture Tool — Command-line interface for automated
              project scaffolding and architecture validation.
            </li>
            <li>
              SentinelView — Cyber Threat Visualiser — Real-time cybersecurity threat
              visualizer simulating network log ingestion and threat pattern rule matching.
            </li>
          </ul>
          <p>
            Contact Kyrell Santillan at santillankyrell@gmail.com. GitHub: github.com/Hazy019.
            LinkedIn: linkedin.com/in/kyrell-santillan. Portfolio: hazy.cosedevs.com.
            Available for full-time engineering roles, contract projects, and research
            opportunities. Based in the Philippines (UTC+8), available remotely worldwide.
          </p>
        </div>
        <ThemeProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
