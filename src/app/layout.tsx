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
    "Kyrell Santillan (Hazy019) — Software Engineer & Systems Architect from Bacolod City, Philippines. Building government infrastructure, autonomous AI pipelines, and high-uptime cloud systems.",
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
        "@type": "ProfilePage",
        "@id": "https://hazy.cosedevs.com/#profilepage",
        url: "https://hazy.cosedevs.com/",
        name: "Kyrell Santillan (Hazy019) — Software Developer & Systems Architect",
        description:
          "Official engineering profile and portfolio of Kyrell Santillan (Hazy019), Software Engineer and Systems Architect from Bacolod City, Philippines.",
        inLanguage: "en",
        mainEntity: {
          "@id": "https://hazy.cosedevs.com/#person",
        },
        isPartOf: {
          "@id": "https://hazy.cosedevs.com/#website",
        },
      },
      {
        "@type": "Person",
        "@id": "https://hazy.cosedevs.com/#person",
        name: "Kyrell Santillan",
        alternateName: ["Hazy019", "HAZY", "kyrell santillan", "Kyrell Santillan", "hazy019"],
        jobTitle: "Software Developer & Systems Architect",
        url: "https://hazy.cosedevs.com/",
        image: "https://hazy.cosedevs.com/logo.png",
        description:
          "Kyrell Santillan (Hazy019) is a Software Engineer and Systems Architect from Bacolod City, Philippines (STI West Negros University), specializing in mission-critical government infrastructure, autonomous AI automation pipelines, and high-uptime cloud systems.",
        email: "mailto:santillankyrell@gmail.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bacolod City",
          addressRegion: "Negros Occidental",
          addressCountry: "PH",
        },
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "STI West Negros University",
          url: "https://wnu.sti.edu/",
        },
        sameAs: [
          "https://github.com/Hazy019",
          "https://www.linkedin.com/in/kyrell-santillan",
          "https://www.facebook.com/profile.php?id=61592218332539",
          "https://pyra-keep-alive-web.vercel.app",
          "https://idee-cli.vercel.app",
          "https://shortsautomations.vercel.app",
          "https://spellgate-eb1e8.web.app",
          "https://client-echo-web.vercel.app",
          "https://www.star-history.com/hazy019",
        ],
        knowsAbout: [
          "Software Engineering",
          "Systems Architecture",
          "Government Software Infrastructure",
          "Distributed Cloud Automation",
          "Keep-Alive & High Uptime Infrastructure",
          "Cybersecurity Engineering",
          "Next.js 15",
          "Python 3.12",
          "FastAPI",
          "Node.js",
          "WebSockets",
          "AWS Lambda",
          "PostgreSQL & SQLite",
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            name: "Foundations of Cybersecurity",
            recognizedBy: {
              "@type": "Organization",
              name: "Google Career Certificates",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Play It Safe: Manage Security Risks",
            recognizedBy: {
              "@type": "Organization",
              name: "Google Career Certificates",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Foundations of User Experience (UX) Design",
            recognizedBy: {
              "@type": "Organization",
              name: "Google Career Certificates",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Responsive Web Design Certification",
            recognizedBy: {
              "@type": "Organization",
              name: "freeCodeCamp",
            },
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "Pyra Keep-Alive Web",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cloud / Web",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Automated cloud keep-alive and uptime monitoring infrastructure service that prevents serverless APIs, free-tier cloud containers, and database backends from sleeping, with AES-256-GCM auth encryption and latency telemetry.",
        url: "https://pyra-keep-alive-web.vercel.app",
      },
      {
        "@type": "SoftwareApplication",
        name: "YouTube Shorts Automated Video Pipeline",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Cloud / AWS Lambda",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Autonomous programmatic video production pipeline leveraging multi-model generative AI (Google Gemini 3), Microsoft Edge-TTS, AWS Lambda parallel rendering with Remotion React, and stateful recovery.",
        url: "https://shortsautomations.vercel.app",
      },
      {
        "@type": "SoftwareApplication",
        name: "DTI Local Queue & Ticket Management System",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Self-Hosted LAN / Linux / Windows",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Government service queue ticketing and real-time counter orchestration system with WebSocket concurrency, thermal receipt printing, and SQLite transaction safety built for the Department of Trade and Industry.",
        url: "https://github.com/Hazy019/DTI-Queue-System",
      },
      {
        "@type": "SoftwareApplication",
        name: "Idée CLI",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform (Node.js / NPX)",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "High-performance developer CLI tool for opinionated project scaffolding, boilerplate generation, and security configuration setup across full-stack applications (npx idee-cli apply).",
        url: "https://idee-cli.vercel.app",
      },
      {
        "@type": "SoftwareApplication",
        name: "SpellGate Screen-Time Spelling Kiosk",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Windows 10/11",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Educational screen-time management kiosk locking down children's PCs behind spelling challenges generated by an AI cascade engine with a real-time parent monitoring dashboard.",
        url: "https://spellgate-eb1e8.web.app",
      },
      {
        "@type": "SoftwareApplication",
        name: "SentinelView Cyber Threat Visualizer",
        applicationCategory: "SecurityApplication",
        operatingSystem: "Web / Linux",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Real-time cybersecurity threat visualizer and SIEM simulator streaming pattern-based intrusion alerts over WebSockets to an interactive 3D Three.js attack globe.",
        url: "https://github.com/Hazy019/SentinelView",
      },
      {
        "@type": "WebSite",
        "@id": "https://hazy.cosedevs.com/#website",
        url: "https://hazy.cosedevs.com/",
        name: "Kyrell Santillan (Hazy019) Portfolio",
        description:
          "Kyrell Santillan (Hazy019) is a Software Engineer and Systems Architect from Bacolod City, Philippines, building mission-critical government infrastructure, autonomous AI automation pipelines, and high-uptime cloud systems.",
        publisher: {
          "@id": "https://hazy.cosedevs.com/#person",
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
         * SSR Identity Block — Server-rendered rich text for Googlebot & AI Overviews.
         *
         * WHY THIS EXISTS:
         * Googlebot and AI search crawlers read HTML byte 0 before JS hydration.
         * This block guarantees high-density semantic entity recognition,
         * verified projects, credentials, and indexing signals.
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
            Kyrell Santillan, known online as Hazy019. Software Engineer and Systems Architect
            based in Bacolod City, Negros Occidental, Philippines. Computer Science graduate from
            STI West Negros University. Specializing in mission-critical government infrastructure,
            autonomous cloud AI pipelines, high-uptime keep-alive services, and cybersecurity systems.
          </p>
          <h2>Featured Systems &amp; Software by Kyrell Santillan</h2>
          <ul>
            <li>
              Pyra Keep-Alive Web — Automated cloud keep-alive and uptime monitoring infrastructure service
              preventing serverless APIs, free-tier cloud containers (Render, Supabase, Neon), and backend
              endpoints from sleeping, with AES-256-GCM auth encryption and latency telemetry.
            </li>
            <li>
              DTI Local Queue &amp; Ticket Management System — Government infrastructure
              real-time WebSocket queue ticketing system built for the Department of Trade
              and Industry of the Philippines with 80mm thermal receipt auto-printing and SQLite concurrency.
            </li>
            <li>
              YouTube Shorts Automated Video Pipeline — Fully automated programmatic video generation pipeline
              leveraging Google Gemini 3, Microsoft Edge-TTS, AWS Lambda parallel rendering, Remotion React, and S3 syndication.
            </li>
            <li>
              IDEE-CLI — Developer Architecture Tool — High-performance Node.js CLI tool for opinionated
              project scaffolding, boilerplate generation, and security configuration setup (npx idee-cli apply).
            </li>
            <li>
              SpellGate — Screen-Time Access Control Kiosk — Walk-up hardware kiosk system locking the
              Windows shell environment behind real-time adaptive AI spelling challenges with live Firebase parent monitoring.
            </li>
            <li>
              Polycon — Consultation &amp; Learning Management System — Full-stack LMS
              with real-time consultation scheduling and AI-powered session transcription via AssemblyAI.
            </li>
            <li>
              SentinelView — Cyber Threat Visualiser — Real-time cybersecurity threat
              visualizer simulating network log ingestion and threat pattern rule matching on a 3D attack globe.
            </li>
          </ul>
          <p>
            Contact Kyrell Santillan at santillankyrell@gmail.com. GitHub: github.com/Hazy019.
            LinkedIn: linkedin.com/in/kyrell-santillan. Facebook: facebook.com/profile.php?id=61592218332539.
            Portfolio: hazy.cosedevs.com. Available for full-time engineering roles, contract projects,
            and systems architecture consulting.
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
