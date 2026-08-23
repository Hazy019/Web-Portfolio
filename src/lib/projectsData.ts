export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectData {
  id: string;
  num: string;
  type: string;
  ghostType: string;
  title: string;
  status: string;
  role: string;
  timeline: string;
  nativeAccent: string;
  accentBorder: string;
  accentGlow: string;
  imageSrc: string;
  screenshots: string[];
  /** Labels for each screenshot slot in the modal gallery.
   *  If a label starts with "TODO:", the modal renders an access-restricted
   *  placeholder instead of silently reusing a landing-page screenshot. */
  screenshotLabels: string[];
  deviceFrame: 'phone' | 'browser' | 'split-terminal' | 'laptop-phone';
  /** Helps recruiters correctly weight each project.
   *  Values: "Government internship deliverable" | "Self-initiated product" |
   *  "Academic collaboration" | "SaaS / Client product" */
  projectNature: string;
  repoUrl?: string;
  liveUrl?: string;
  outcomeBadge: string;
  narrative: string;
  problem: string;
  solution: string;
  steps: string[];
  specs: ProjectSpec[];
  stack: string[];
  devnotes: string;
  outcome: string;
}

export const PROJECTS: ProjectData[] = [
  {
    id: 'yt-shorts',
    num: '01',
    type: 'Cloud & Automation Engineering',
    ghostType: 'AUTOMATION',
    title: 'YouTube Shorts Automation',
    status: 'Live',
    role: 'Solo Developer',
    timeline: '2026',
    nativeAccent: '#84cc16',
    accentBorder: 'rgba(132, 204, 22, 0.4)',
    accentGlow: 'rgba(132, 204, 22, 0.15)',
    imageSrc: '/Shortsautomation_mockup_preview.png',
    screenshots: [
      '/Shortsautomation_mockup_preview.png',
      '/Shortsautomation_phone_preview.webp',
      '/Shortsautomation_preview.webp'
    ],
    screenshotLabels: [
      'Primary Mockup',
      'Mobile View — Pipeline UI',
      'System Output — Generated Video'
    ],
    deviceFrame: 'phone',
    projectNature: 'Self-initiated product',
    repoUrl: 'https://github.com/Hazy019/youtube-shorts-automation',
    liveUrl: 'https://shortsautomations.vercel.app/',
    outcomeBadge: '85% Lambda memory reduction',
    narrative: 'A fault-tolerant, fully autonomous programmatic video production pipeline leveraging multi-model generative AI, stateful recovery, and serverless parallel rendering to syndicate high-retention content at scale.',
    problem: 'Creating short-form content at scale requires generating scripts, recording voiceovers, sourcing B-roll, rendering video, syncing captions, and uploading to multiple platforms — every single day. Doing this manually for two independent channels was unsustainable and would require a full production team.',
    solution: 'YouTube Shorts Automation is a fully autonomous video production pipeline. It leverages multi-model generative AI, serverless parallel rendering, and stateful recovery to syndicate high-retention video content across YouTube Shorts, TikTok, and Meta (Instagram/Facebook Reels) at scale, while keeping costs minimal by integrating with free APIs (Gemini, Pexels, Pixabay).',
    steps: [
      'Gemini 3 Flash synthesizes a structured script, optimized search keywords, and viral metadata from target topics',
      'Microsoft Edge-TTS generates neural speech and outputs word-boundary timestamps for dynamic karaoke captions',
      'Orchestrator queries free stock APIs (Pexels, Pixabay) and trims clips proportionally to the audio segment to save bandwidth',
      'Remotion (React) renders the video programmatically using OffthreadVideo to bypass browser-level decoding bottlenecks',
      'Parallel rendering runs on AWS Lambda in chunked segments, syncing final products in AWS S3 before parallel syndication'
    ],
    specs: [
      { label: 'Rendering', value: 'Remotion (React) via AWS Lambda' },
      { label: 'Optimization', value: 'Puppeteer OffthreadVideo (85% Memory Saved)' },
      { label: 'Self-Healing', value: 'Supabase + JSON-Failsafe Recovery Layer' },
      { label: 'Workflow', value: 'GitHub Actions Automated Runs (ET 6:30 AM/PM)' }
    ],
    stack: ['Python 3.12', 'Google Gemini 3', 'Microsoft Edge-TTS', 'Remotion (React)', 'AWS Lambda', 'AWS S3', 'Supabase', 'Discord Webhooks', 'GitHub Actions'],
    devnotes: 'The system uses two critical performance optimizations: High-Performance Offthread Rendering and Proportional Video Segment Trimming. Headless Chrome (Puppeteer) in Lambda does not support hardware acceleration; loading multiple HTML5 video elements triggers massive bottlenecks. We use OffthreadVideo, running native FFmpeg inside the container to extract frames as images and inject them into canvas, saving 85% memory. To save S3 bandwidth, src/media/assets.py calculates the frame budget dynamically so we only trim and download what we need, not the full source clips.',
    outcome: 'Sub-second S3 video transfers, 85% reduction in Lambda memory via Offthread Rendering, and 100% automated daily GitHub Actions scheduler.'
  },
  {
    id: 'dti-queue',
    num: '02',
    type: 'Government Infrastructure',
    ghostType: 'WEBSITE',
    title: 'DTI Queue System',
    status: 'Live (Restricted Access)',
    role: 'Lead Developer',
    timeline: '2026',
    nativeAccent: '#eab308',
    accentBorder: 'rgba(234, 179, 8, 0.4)',
    accentGlow: 'rgba(234, 179, 8, 0.15)',
    imageSrc: '/DTI_Queue_mockup_preview.png',
    screenshots: [
      '/DTI_Queue_mockup_preview.png',
      '/DTI_Queue_phone_preview.png',
      '/DTI_Queue_preview.webp'
    ],
    screenshotLabels: [
      'Primary Mockup — Cashier Dashboard',
      'Kiosk View — Customer Ticket Interface',
      'System Output — Live Queue Monitor'
    ],
    deviceFrame: 'browser',
    projectNature: 'Government internship deliverable',
    outcomeBadge: '1,800+ Active Centers · LAN-based',
    narrative: 'The Department of Trade and Industry\'s regional branch was processing walk-ins with paper slips and a whiteboard. Rebuilt from scratch — real-time WebSocket ticket generation, role-based access, and a live admin dashboard with full audit history.',
    problem: 'The DTI Payment Office managed walk-in client flow with paper ticket slips, a whiteboard, and verbal call-outs. There was no audit trail, no way to measure wait times, no mechanism to handle multiple service lanes simultaneously, and no visibility for clients on where they stood in the queue.',
    solution: 'A self-hosted, LAN-based smart queue management system with four purpose-built interfaces: a customer Kiosk for ticket issuance, a Cashier dashboard for queue management, a public Monitor display, and an Admin panel for lane configuration and analytics.',
    steps: [
      'Customer walks up to the Kiosk (/kiosk), selects service type, and receives a printed thermal ticket (80mm format)',
      'Socket.io broadcasts the new ticket to all connected dashboards in real time — cashier sees it instantly',
      'Cashier (/cashier) calls the next ticket, marking each transaction as called, serving, or done via their dashboard',
      'Public Monitor (/monitor) displays the live now-serving number on a TV screen in the waiting area',
      'Admin (/admin) configures lanes, manages cashier accounts, and views daily queue analytics'
    ],
    specs: [
      { label: 'Deployment', value: 'Self-Hosted LAN (No Internet Required)' },
      { label: 'Interfaces', value: 'Kiosk · Cashier · Monitor · Admin' },
      { label: 'Database', value: 'SQLite via Prisma ORM' },
      { label: 'Printer', value: '80mm Thermal (Auto-Print)' }
    ],
    stack: ['Node.js', 'Express.js', 'Socket.io', 'Prisma ORM', 'SQLite', 'React (Vite)', 'JWT', 'bcryptjs', 'Helmet', 'node-cron'],
    devnotes: 'The biggest constraint was reliability on aging office hardware with no IT staff on-site. I chose SQLite over PostgreSQL specifically because it requires zero server setup — a single .db file, no service to manage. Prisma handles migrations cleanly. The Socket.io reconnection logic was critical: office routers drop connections intermittently, so every client implements exponential backoff with a persistent connection state indicator.',
    outcome: 'Queue throughput increased, paper records eliminated. Now the branch\'s primary operational system.'
  },
  {
    id: 'polycon',
    num: '03',
    type: 'Academic Platform',
    ghostType: 'WEBSITE',
    title: 'Polycon — Consultation System',
    status: 'Live (Restricted Access)',
    role: 'Full-Stack Developer',
    timeline: '2024-2026',
    nativeAccent: '#3b82f6',
    accentBorder: 'rgba(59, 130, 246, 0.4)',
    accentGlow: 'rgba(59, 130, 246, 0.15)',
    imageSrc: '/Polycon_mockup_preview.png',
    screenshots: [
      '/Polycon_mockup_preview.png',
      '/Polycon_phone_preview.jfif',
      '/Polycon_preview.webp'
    ],
    screenshotLabels: [
      'Primary Mockup — Student Booking Portal',
      'Mobile View — Faculty Notification Panel',
      'System Output — POLYCON Analysis Dashboard'
    ],
    deviceFrame: 'browser',
    projectNature: 'Academic collaboration',
    repoUrl: 'https://github.com/xenhusk/POLYCON',
    outcomeBadge: 'Zero missed appointments since launch',
    narrative: 'Faculty-student consultations at the polytechnic had no digital infrastructure. Polycon is a full-stack LMS with real-time scheduling, AI-powered session transcription via AssemblyAI, grade-improvement tracking, and portal access.',
    problem: 'Faculty-student consultations at the polytechnic were entirely unstructured. Bookings were made via text message, sessions were undocumented, grade improvement was unmeasured, and there was no way to determine whether consultations were actually helping students.',
    solution: 'Polycon — a full-stack educational consultation and learning management system. Students book sessions through a scheduling interface, faculty manage availability and session notes, and an analytics engine statistically measures consultation impact on student grades.',
    steps: [
      'Student authenticates via JWT and views real-time faculty availability through the booking calendar',
      'Booking request triggers a Flask-SocketIO event — faculty receives an instant notification',
      'Faculty accepts or reschedules; APScheduler sends reminder emails before the session',
      'During or after the session, faculty fills a structured form; audio recordings are transcribed by AssemblyAI',
      'Admin dashboard runs POLYCON Analysis correlating consultation count with grade delta across academic periods'
    ],
    specs: [
      { label: 'Analytics', value: 'POLYCON Analysis (Grade vs Consultation)' },
      { label: 'Transcription', value: 'AssemblyAI (Audio-to-Text)' },
      { label: 'Deployment', value: 'Render.com + Docker' },
      { label: 'Access Control', value: 'Student · Faculty · Admin (JWT)' }
    ],
    stack: ['Flask (Python 3.11)', 'React 18', 'PostgreSQL', 'Flask-SocketIO', 'SQLAlchemy', 'JWT', 'AssemblyAI', 'Google Generative AI', 'Docker'],
    devnotes: 'The POLYCON Analysis module was research-heavy — I defined a statistically meaningful way to measure consultation effectiveness on student grades by computing grade deltas across academic periods.',
    outcome: 'Zero missed appointments since launch. Session documentation rate went from near-zero to 100%. Academic reports now produced from real consultation data.'
  },
  {
    id: 'idee-cli',
    num: '04',
    type: 'Developer Tooling & CLI',
    ghostType: 'TERMINAL',
    title: 'IDEE-CLI',
    status: 'Live',
    role: 'Solo Developer',
    timeline: '2025',
    nativeAccent: '#22c55e',
    accentBorder: 'rgba(34, 197, 94, 0.4)',
    accentGlow: 'rgba(34, 197, 94, 0.15)',
    imageSrc: '/IDEE-CLI_mockup_preview.png',
    screenshots: [
      '/IDEE-CLI_mockup_preview.png',
      '/IDEE-CLI_phone_preview.webp',
      '/IDEE-CLI_preview.webp'
    ],
    screenshotLabels: [
      'Primary Mockup — CLI Interface',
      'Terminal View — Interactive Prompts',
      'System Output — Scaffolded Project'
    ],
    deviceFrame: 'split-terminal',
    projectNature: 'Self-initiated product',
    repoUrl: 'https://github.com/Hazy019/idee-cli',
    liveUrl: 'https://idee-cli.vercel.app/',
    outcomeBadge: 'Instant project scaffolding in <3 seconds',
    narrative: 'A high-performance developer CLI tool for opinionated project scaffolding, boilerplate generation, and security configuration setup across full-stack applications.',
    problem: 'Setting up new full-stack projects with strict security headers, authentication boilerplate, and consistent linting rules was repetitive and error-prone.',
    solution: 'IDEE-CLI (`npx idee-cli apply`) automates repository setup, environment config validation, and security profile application in seconds through an interactive terminal interface.',
    steps: [
      'Developer invokes `npx idee-cli apply` with project flags',
      'CLI validates target directory environment and security parameters',
      'Generates optimized boilerplate code with strict linting and environment variables',
      'Configures Git hooks and automated security scanning rules'
    ],
    specs: [
      { label: 'Execution', value: 'Node.js / NPX Instant Execution' },
      { label: 'Speed', value: '<3s Complete Scaffolding' },
      { label: 'Security', value: 'Automated Secrets Audit' },
      { label: 'UI', value: 'Interactive Ink / Chalk CLI' }
    ],
    stack: ['Node.js', 'TypeScript', 'Ink (React for CLI)', 'Commander.js', 'Chalk', 'Execa'],
    devnotes: 'Designed to deliver immediate feedback with animated terminal spinners and zero-config defaults while strictly checking environmental constraints.',
    outcome: 'Reduces setup time for new microservices and frontend applications from 45 minutes to under 3 seconds.'
  },
  {
    id: 'sentinel-view',
    num: '05',
    type: 'Cybersecurity Engineering',
    ghostType: 'SECURITY',
    title: 'SentinelView',
    status: 'Repo Only',
    role: 'Solo Developer',
    timeline: '2026',
    nativeAccent: '#06b6d4',
    accentBorder: 'rgba(6, 182, 212, 0.4)',
    accentGlow: 'rgba(6, 182, 212, 0.15)',
    imageSrc: '/Sentinel_mockup_preview.png',
    screenshots: [
      '/Sentinel_mockup_preview.png',
      '/Sentinel_phone_preview.jfif',
      '/Sentinel_preview.jfif'
    ],
    screenshotLabels: [
      'Primary Mockup — 3D Attack Globe',
      'Login View — DEMO ENVIRONMENT',
      'System Output — Live Threat Feed'
    ],
    deviceFrame: 'browser',
    projectNature: 'Self-initiated product',
    repoUrl: 'https://github.com/Hazy019/SentinelView',
    outcomeBadge: 'Sub-second alert latency · 10,000+ logs/sec',
    narrative: 'A real-time cybersecurity threat visualiser simulating network log ingestion, detecting pattern-based threat vectors, and pushing live WebSocket alerts to a glassmorphic dashboard with a 3D attack globe.',
    problem: 'Modern SIEMs are complex and lack accessible visual context, while demo threat dashboards rely on static mock data or ignore authentication constraints.',
    solution: 'SentinelView simulates real-time network log ingestion. A FastAPI backend processes logs in memory, detecting brute-force attempts and data exfiltration, pushing WebSocket alerts to a Next.js frontend with a 3D attack globe.',
    steps: [
      'Python log generator pushes synthetic network logs to the FastAPI backend API',
      'FastAPI consumes events and runs deterministic rule matching (sliding-window IP tracking, byte thresholds)',
      'Active threat matches trigger alerts, archived in SQLite (WAL mode) and pushed via WebSockets',
      'WebSocket connection authorizes users via one-time tickets (UUID v4, 30s TTL)',
      'Next.js UI renders alerts on a 3D R3F/Three.js attack globe'
    ],
    specs: [
      { label: 'Threat Logic', value: 'Deterministic Sliding-Window Rules' },
      { label: 'Session Security', value: 'React-Memory JWT + One-Time Ticket Socket Auth' },
      { label: 'DB Architecture', value: 'SQLite WAL Mode' },
      { label: 'Visualization', value: 'Three.js / React Three Fiber Globe' }
    ],
    stack: ['FastAPI', 'WebSockets', 'Next.js 14', 'TypeScript', 'React Three Fiber', 'Three.js', 'SQLite (WAL Mode)', 'Tailwind CSS'],
    devnotes: 'The main challenge was managing session persistence securely without localStorage. JWTs are kept in React memory only; WebSocket auth uses a one-time ticket system so JWT is never leaked in URLs.',
    outcome: 'Simulated 10,000+ logs/sec with sub-second alert latency. Real-time visualization of brute-force and data exfiltration patterns.'
  },
  {
    id: 'spell-gate',
    num: '06',
    type: 'UX & System Engineering',
    ghostType: 'KIOSK',
    title: 'SpellGate',
    status: 'Live',
    role: 'Solo Developer',
    timeline: '2025-2026',
    nativeAccent: '#8b5cf6',
    accentBorder: 'rgba(139, 92, 246, 0.4)',
    accentGlow: 'rgba(139, 92, 246, 0.15)',
    imageSrc: '/SpellGate_mockup_preview.png',
    screenshots: [
      '/SpellGate_mockup_preview.png',
      '/SpellGate_phone_preview.webp',
      '/SpellGate_preview.webp'
    ],
    screenshotLabels: [
      'Primary Mockup — Kiosk Lock Screen',
      'Mobile View — Parent Dashboard',
      'System Output — Spelling Challenge'
    ],
    deviceFrame: 'laptop-phone',
    projectNature: 'Self-initiated product',
    repoUrl: 'https://github.com/Hazy019/SpellGate',
    liveUrl: 'https://spellgate-eb1e8.web.app/',
    outcomeBadge: 'Locks Windows shell · Real-time Firebase link',
    narrative: 'An educational screen-time management kiosk locking down children\'s PCs behind spelling challenges generated by an AI cascade engine, complete with a real-time parent monitoring dashboard.',
    problem: 'Children have unmonitored screen time. Traditional parental controls feel restrictive or punitive, rather than educational, and lack real-time control features.',
    solution: 'SpellGate gamifies spelling by intercepting screen-time behind a hardware kiosk-mode lock screen (PyQt6 on Windows). Children earn playtime by solving spelling challenges, while parents monitor in real time via Firebase.',
    steps: [
      'PyQt6 kiosk locks the Windows shell environment (disabling Alt-Tab, Windows key, Task Manager)',
      'Built-in TTS reads spelling words; child inputs answers, and Gemini AI validates spelling',
      'If offline, system falls back to a local JSON library of 150+ curated spelling words',
      'Earned playtime is stored in a locally persisted JSON bank',
      'Kiosk pushes session progress to Firebase Firestore for remote parent monitoring'
    ],
    specs: [
      { label: 'Kiosk Security', value: 'Alt-Tab/TaskMgr Lockdown + Watchdog Daemon' },
      { label: 'Parent Link', value: '6-digit Pairing Code + Firebase Sync' },
      { label: 'AI Engine', value: 'Gemini Cascade (Offline Fallback)' },
      { label: 'Data Bank', value: 'AppData Local SQLite Bank' }
    ],
    stack: ['Python 3.12', 'PyQt6', 'React', 'Vite', 'Firebase Firestore', 'Google Gemini AI', 'Keyring API'],
    devnotes: 'A separate watchdog.py background daemon runs as a system process to monitor the main kiosk status and auto-spawn it if killed.',
    outcome: 'Successfully locks Windows shell environment. Direct real-time Firebase pairing. Adapts difficulty based on child accuracy.'
  },
  {
    id: 'client-echo',
    num: '07',
    type: 'SaaS / Platform Engineering',
    ghostType: 'SAAS',
    title: 'ClientEcho',
    status: 'Live',
    role: 'Solo Developer',
    timeline: '2026',
    nativeAccent: '#f97316',
    accentBorder: 'rgba(249, 115, 22, 0.4)',
    accentGlow: 'rgba(249, 115, 22, 0.15)',
    imageSrc: '/ClientEcho_mockup_preview.png',
    screenshots: [
      '/ClientEcho_mockup_preview.png',
      '/ClientEcho_phone_preview.png',
      '/ClientEcho_preview.png'
    ],
    screenshotLabels: [
      'Primary Mockup — Landing Page',
      'Mobile View — Magic-Link Approval Flow',
      'Desktop Interface — Embed & Review System'
    ],
    deviceFrame: 'browser',
    projectNature: 'SaaS / Client product',
    liveUrl: 'https://client-echo-web.vercel.app/',
    repoUrl: 'https://github.com/Hazy019/ClientEcho',
    outcomeBadge: 'Multi-tenant · Stripe billing · Zero-CLS embeds',
    narrative: 'A multi-tenant B2B SaaS platform for collecting, verifying, and embedding client testimonials — 1-click cryptographic magic-link approvals, Postgres row-level security per tenant, sandboxed zero-CLS embed widgets, and full Stripe billing.',
    problem: 'Businesses collecting client testimonials relied on manual email chains, screenshot trust-signals, and copy-pasted quotes with no verifiable audit trail. Embedding testimonials caused layout shift, slowed pages, and had no real-time update mechanism.',
    solution: 'ClientEcho automates the full testimonial lifecycle — businesses invite clients via a cryptographic magic-link (one-time, time-limited), clients approve in one click with no account required, and verified testimonials are embedded via a sandboxed zero-CLS widget. Each tenant\'s data is isolated via Postgres row-level security.',
    steps: [
      'Business creates a testimonial request; ClientEcho generates a cryptographic magic-link token (signed, short-TTL)',
      'Client receives the link, reviews the draft testimonial, and approves in one click — no account creation required',
      'Approval triggers Cloudflare Turnstile verification and stores the approval event with a tamper-evident audit record',
      'Verified testimonial is immediately available in the business dashboard and pushed to all embed widgets via Upstash Redis cache invalidation',
      'Embed widget (sandboxed iframe, zero-CLS) renders the testimonial on any site without JavaScript bundle overhead'
    ],
    specs: [
      { label: 'Multi-tenancy', value: 'Postgres Row-Level Security (per tenant)' },
      { label: 'Auth Flow', value: 'Cryptographic Magic-Link (signed + TTL)' },
      { label: 'Billing', value: 'Stripe Checkout + Webhook lifecycle' },
      { label: 'Cache', value: 'Upstash Redis + Edge invalidation' }
    ],
    stack: ['Next.js 14', 'PostgreSQL (Supabase RLS)', 'Drizzle ORM', 'Stripe', 'Cloudflare Turnstile', 'Upstash Redis', 'TailwindCSS', 'Framer Motion'],
    devnotes: 'The most complex part was the multi-tenant RLS architecture: every Postgres query automatically scopes to the authenticated tenant\'s row set via a session-level set_config call, so cross-tenant data leakage is architecturally impossible rather than just policy-enforced. The embed widget is deliberately sandboxed as an iframe with a strict Content-Security-Policy to prevent XSS from the host page.',
    outcome: 'Full end-to-end testimonial lifecycle automation. Zero-CLS embeds with sub-100ms load time. Stripe billing with webhook-driven subscription state machine.'
  }
];
