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
  title: {
    default: "Kyrell Santillan — Software Engineer & Systems Architect | HAZY",
    template: "%s | Kyrell Santillan",
  },
  description:
    "Kyrell Santillan (Hazy019) is a Software Engineer & Systems Architect from Bacolod City, Philippines. Creator of the DTI government queue system, Pyra Keep-Alive, automated AI pipelines, and distributed cloud applications.",
  keywords: [
    "Kyrell Santillan",
    "Kyrell",
    "Santillan",
    "Hazy",
    "Hazy019",
    "HAZY",
    "Software Engineer",
    "Systems Architect",
    "Full-Stack Developer",
    "Cloud Automation Engineer",
    "Backend Engineer",
    "Frontend Developer",
    "Next.js Developer",
    "TypeScript Engineer",
    "Python Developer",
    "FastAPI",
    "AWS Lambda",
    "Remotion React",
    "DTI Queue System",
    "YouTube Shorts Automation",
    "Pyra Keep-Alive",
    "IDEE-CLI",
    "SentinelView",
    "SpellGate",
    "ClientEcho",
    "Polycon",
    "Bacolod City Developer",
    "Philippines Software Engineer",
    "cosedevs",
  ],
  authors: [{ name: "Kyrell Santillan", url: "https://hazy.cosedevs.com" }],
  creator: "Kyrell Santillan",
  publisher: "Kyrell Santillan",
  metadataBase: new URL("https://hazy.cosedevs.com"),
  alternates: {
    canonical: "/",
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
    locale: "en_US",
    url: "https://hazy.cosedevs.com",
    siteName: "Kyrell Santillan · Portfolio",
    title: "Kyrell Santillan — Software Engineer & Systems Architect | HAZY",
    description:
      "Official portfolio of Kyrell Santillan (Hazy019) — Software Engineer & Systems Architect building mission-critical government infrastructure, automated cloud AI pipelines, and high-uptime software.",
    images: [
      {
        url: "https://hazy.cosedevs.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Kyrell Santillan (Hazy019) — Software Engineer & Systems Architect",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyrell Santillan — Software Engineer & Systems Architect | HAZY",
    description:
      "Software Engineer & Systems Architect building mission-critical government infrastructure, automated cloud AI pipelines, and high-uptime software.",
    images: ["https://hazy.cosedevs.com/logo.png"],
    creator: "@hazy019",
    site: "@hazy019",
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
        "@type": "WebSite",
        "@id": "https://hazy.cosedevs.com/#website",
        url: "https://hazy.cosedevs.com/",
        name: "Kyrell Santillan (Hazy019) Portfolio",
        description:
          "Official software engineering portfolio of Kyrell Santillan (Hazy019), Software Engineer and Systems Architect from Bacolod City, Philippines.",
        publisher: {
          "@id": "https://hazy.cosedevs.com/#person",
        },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfilePage",
        "@id": "https://hazy.cosedevs.com/#profilepage",
        url: "https://hazy.cosedevs.com/",
        name: "Kyrell Santillan (Hazy019) — Software Engineer & Systems Architect",
        description:
          "Engineering portfolio, open-source projects, and technical case studies by Kyrell Santillan (Hazy019).",
        inLanguage: "en-US",
        isPartOf: {
          "@id": "https://hazy.cosedevs.com/#website",
        },
        about: {
          "@id": "https://hazy.cosedevs.com/#person",
        },
        mainEntity: {
          "@id": "https://hazy.cosedevs.com/#person",
        },
      },
      {
        "@type": "Person",
        "@id": "https://hazy.cosedevs.com/#person",
        name: "Kyrell Santillan",
        alternateName: ["Hazy019", "HAZY", "kyrell santillan", "Kyrell Santillan", "hazy019", "Hazy"],
        jobTitle: "Software Engineer & Systems Architect",
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
          "https://www.youtube.com/@Hazy_Insight",
          "https://pyra-keep-alive-web.vercel.app",
          "https://shortsautomations.vercel.app",
          "https://idee-cli.vercel.app",
          "https://spellgate-eb1e8.web.app",
          "https://client-echo-web.vercel.app",
          "https://www.star-history.com/hazy019",
        ],
        knowsAbout: [
          "Software Engineering",
          "Systems Architecture",
          "Full-Stack Web Development",
          "Government Software Infrastructure",
          "Distributed Cloud Automation",
          "Keep-Alive & High Uptime Infrastructure",
          "Cybersecurity Engineering",
          "Next.js 15",
          "React 19",
          "Python 3.12",
          "FastAPI",
          "Node.js",
          "TypeScript",
          "WebSockets & Socket.io",
          "AWS Lambda & S3",
          "PostgreSQL & Supabase",
          "SQLite & Prisma ORM",
          "Docker",
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
        "@id": "https://hazy.cosedevs.com/#software-pyra",
        name: "Pyra Keep-Alive Web",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cloud / Web",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        creator: { "@id": "https://hazy.cosedevs.com/#person" },
        publisher: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Automated cloud keep-alive and uptime monitoring infrastructure service that prevents serverless APIs, free-tier cloud containers, and database backends from sleeping, with AES-256-GCM auth encryption and latency telemetry.",
        url: "https://pyra-keep-alive-web.vercel.app",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://hazy.cosedevs.com/#software-yt-shorts",
        name: "YouTube Shorts Automated Video Pipeline",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Cloud / AWS Lambda",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        creator: { "@id": "https://hazy.cosedevs.com/#person" },
        publisher: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Autonomous programmatic video production pipeline leveraging multi-model generative AI (Google Gemini 3), Microsoft Edge-TTS, AWS Lambda parallel rendering with Remotion React, and stateful recovery.",
        url: "https://shortsautomations.vercel.app",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://hazy.cosedevs.com/#software-dti-queue",
        name: "DTI Local Queue & Ticket Management System",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Self-Hosted LAN / Linux / Windows",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        creator: { "@id": "https://hazy.cosedevs.com/#person" },
        publisher: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Government service queue ticketing and real-time counter orchestration system with WebSocket concurrency, thermal receipt printing, and SQLite transaction safety built for the Department of Trade and Industry.",
        url: "https://github.com/Hazy019/DTI-Queue-System",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://hazy.cosedevs.com/#software-idee-cli",
        name: "Idée CLI",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform (Node.js / NPX)",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        creator: { "@id": "https://hazy.cosedevs.com/#person" },
        publisher: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "High-performance developer CLI tool for opinionated project scaffolding, boilerplate generation, and security configuration setup across full-stack applications (npx idee-cli apply).",
        url: "https://idee-cli.vercel.app",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://hazy.cosedevs.com/#software-spellgate",
        name: "SpellGate Screen-Time Spelling Kiosk",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Windows 10/11",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        creator: { "@id": "https://hazy.cosedevs.com/#person" },
        publisher: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Educational screen-time management kiosk locking down children's PCs behind spelling challenges generated by an AI cascade engine with a real-time parent monitoring dashboard.",
        url: "https://spellgate-eb1e8.web.app",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://hazy.cosedevs.com/#software-sentinelview",
        name: "SentinelView Cyber Threat Visualizer",
        applicationCategory: "SecurityApplication",
        operatingSystem: "Web / Linux",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        creator: { "@id": "https://hazy.cosedevs.com/#person" },
        publisher: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Real-time cybersecurity threat visualizer and SIEM simulator streaming pattern-based intrusion alerts over WebSockets to an interactive 3D Three.js attack globe.",
        url: "https://github.com/Hazy019/SentinelView",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://hazy.cosedevs.com/#software-clientecho",
        name: "ClientEcho Testimonial Platform",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Cloud / Web",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        creator: { "@id": "https://hazy.cosedevs.com/#person" },
        publisher: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "B2B SaaS platform automating testimonial capture with 1-click magic approval links, zero-CLS sandboxed embed widgets, and Postgres row-level security.",
        url: "https://client-echo-web.vercel.app",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://hazy.cosedevs.com/#software-polycon",
        name: "Polycon Academic Consultation System",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web / Cloud",
        author: { "@id": "https://hazy.cosedevs.com/#person" },
        creator: { "@id": "https://hazy.cosedevs.com/#person" },
        publisher: { "@id": "https://hazy.cosedevs.com/#person" },
        description:
          "Full-stack educational consultation portal with real-time faculty booking, AI session audio transcription via AssemblyAI, and statistical grade impact analytics.",
        url: "https://github.com/xenhusk/POLYCON",
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

