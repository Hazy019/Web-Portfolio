# SEO Action Checklist — hazy.cosedevs.com
> Generated: 2026-10-12 · Status: "Page is not indexed: Crawled – currently not indexed"

---

## What was fixed in code (this PR)

- [x] `meta keywords` removed — Google ignores them; stuffing was a spam signal
- [x] `history.scrollRestoration = 'manual'` — prevents browser from restoring stale scroll
- [x] `sitemap.ts` lastmod changed from `new Date()` (dynamic noise) to a truthful static date
- [x] `vercel.json` — 301 redirects from `hazyfactory.vercel.app` and `hazy-dev.vercel.app` to canonical domain
- [x] `<link rel="canonical">` on homepage (no trailing slash, matches sitemap URL)
- [x] OG/Twitter title under 60 characters, description under 155 characters
- [x] SSR identity block changed from `aria-hidden` to `sr-only` (eliminates cloaking risk)
- [x] Duplicate `<h1>` fixed — Hero.tsx has the page h1 (via aria-label), SSR block uses h2
- [x] Page title leads with name for entity recognition
- [x] Consistent job title: "Software Engineer" (more accurate + more searchable)

---

## What you must do manually (cannot be done in code)

### Priority 1 — Do these today (submit to crawlers)

1. **Google Search Console → Sitemaps**
   - Submit `https://hazy.cosedevs.com/sitemap.xml`
   - Then **Request Indexing** for `https://hazy.cosedevs.com` directly
   - Wait 3–14 days; do not click "Request Indexing" more than once per URL

2. **Bing Webmaster Tools**
   - Sign in at `https://www.bing.com/webmasters`
   - Import your site from Google Search Console (one click)
   - Submit sitemap there too

### Priority 2 — Do these this week (authority signals)

3. **GitHub profile** (`github.com/Hazy019`)
   - Add `https://hazy.cosedevs.com` in the "Website" field
   - Set your bio to: *"Software Engineer · Building systems that don't fail · Philippines"*
   - Add portfolio URL to every project repo's "Website" field

4. **LinkedIn** (`linkedin.com/in/kyrell-santillan`)
   - Add portfolio to Featured section
   - Ensure title is "Software Engineer" (consistent with portfolio)
   - One-sentence bio: *"Software engineer from the Philippines. Built a government queue system, an autonomous content pipeline, and 6 more shipped products."*

5. **npm** — Add website link to `idee-cli` package page if you manage the npm profile

6. **Consistent name everywhere:**
   - Use exactly: **Kyrell Santillan** + **Software Engineer** + **Philippines**
   - Same one-sentence bio on GitHub, LinkedIn, npm, Dev.to/Hashnode

### Priority 3 — Do these this month (content depth)

7. **Confirm institution name** (inconsistency detected):
   - Metadata/About says "STI West Negros University"
   - Endorsement card says "Technological Institute of the Philippines"
   - **TODO(owner): Which is correct?** Make every mention consistent.
   - Update `layout.tsx` `alumniOf` schema + every visible mention on the site.

8. **Confirm location** (inconsistency detected):
   - `metadata.description` says "Bacolod City"
   - Hero section only says "Philippines"
   - Use one consistent phrase: *"Bacolod City, Philippines"* everywhere

9. **Create project pages** (`/projects/[slug]`):
   - Real crawlable URLs give Google more to index
   - Each page: problem → approach → stack → result, 400+ words
   - Link them from the homepage and from each project card
   - This is the highest-leverage SEO action after indexing the homepage

10. **Publish one technical post:**
    - Platform: Dev.to or Hashnode (both index fast and have domain authority)
    - Topic suggestion: "How I built the DTI queue system on SQLite + Socket.io"
    - Include: your name, a link to the portfolio, and the GitHub repo link
    - One quality post from an external domain is worth more than 10 meta tags

### Priority 4 — Consider longer term

11. **Exact-match domain:**
    - `kyrellsantillan.com` is the strongest single signal for ranking a personal name
    - Set it as the canonical, redirect `hazy.cosedevs.com` to it
    - Not urgent, but valuable if you're targeting direct name searches

12. **External links from peers/employers:**
    - Ask anyone who references your work (school projects, internship) to link your portfolio
    - One real link from a university site outweighs any on-page optimization

---

## About AI Overviews (honest assessment)

AI Overviews (Google Search Generative Experience) **cannot be directly targeted or enabled**. They are generated from pages Google has already indexed with sufficient confidence in the source's authority and entity consistency.

**Your current blocker is indexing itself.** Google fetched your page and decided it wasn't distinctive enough to store yet. The most likely reasons:

1. One URL, limited text content visible at crawl time (JS-heavy loader)
2. Very few inbound links — the only link Google found came from a staging page on `uat-app.onlinejobs.ph`
3. No strong entity corroboration — the portfolio, GitHub, LinkedIn, and npm aren't cross-linked consistently

**What actually moves the needle:**
1. Get indexed first (steps 1–2 above)
2. Earn real inbound links (steps 3–5, then 10)
3. Be consistent everywhere (step 6, 7, 8)

Indexing can take 2–6 weeks after submissions. Results are not guaranteed, especially for a subdomain with no prior authority. This is normal for new personal sites. Do not buy links or use SEO services — they make this worse.

---

## Open questions for owner
- [ ] Which university is correct: STI West Negros University or Technological Institute of the Philippines?
- [ ] Do you want the hero title changed from "Systems Architect" to "Software Engineer" in the visible heading? (Recommended: keep "Systems Architect" as a descriptor in the `[ 01 // ... ]` label, change the main nav/page title to "Software Engineer" for searchability.)
- [ ] Confirm if there are other Kyrell Santillan name collisions to differentiate from.
- [ ] Portrait photo for the hero section (see Task 3 placeholder at `/public/images/kyrell-portrait.webp`): needs a square-ish 4:5 crop, 1600px on the long edge, eye line at upper third.
