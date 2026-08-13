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
  deviceFrame: 'phone' | 'browser' | 'split-terminal' | 'laptop-phone';
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
    deviceFrame: 'phone',
    repoUrl: 'https://github.com/Hazy019/youtube-shorts-automation',
    liveUrl: 'https://shortsautomations.vercel.app/',
    outcomeBadge: '85% Lambda memory reduction',
    narrative: 'An enterprise-grade, fully autonomous programmatic video production pipeline leveraging multi-model generative AI, stateful recovery, and serverless parallel rendering to syndicate high-retention content at scale.',
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
    deviceFrame: 'browser',
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
    deviceFrame: 'browser',
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
    deviceFrame: 'split-terminal',
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
      '/Sentinel_phone_preview.png',
      '/Sentinel_preview.webp'
    ],
    deviceFrame: 'browser',
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
    deviceFrame: 'laptop-phone',
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
  }
];
