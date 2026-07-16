document.addEventListener('DOMContentLoaded', () => {

    /* ═══════════════════════════════════════════
       0. LOADER — skipped (hidden via CSS)
          Fire all init functions immediately
    ═══════════════════════════════════════════ */
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';

    function finishLoader() {
        document.getElementById('left-panel')?.classList.add('panel-loaded');
        document.querySelector('.lp-nav')?.classList.add('nav-loaded');
        runHeroEntrance();
        initScrollObservers();
        initWordSplitReveal();
        initFooterAnimation();
        initRotatingText();
        initStickySection();
        initImpactStats();
        initSectionFlashes();
        initQuoteParallax();
        initDocModal();
    }

    finishLoader();


    /* Helper functions for safe localstorage access */
    function getThemeSafe() {
        try {
            return localStorage.getItem('hazy-theme') || 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    function setThemeSafe(theme) {
        try {
            localStorage.setItem('hazy-theme', theme);
        } catch (e) {
            // ignore sandboxed error
        }
    }

    /* ═══════════════════════════════════════════
       1. THEME RIPPLE TOGGLE
    ═══════════════════════════════════════════ */
    const html      = document.documentElement;
    const themeBtns = document.querySelectorAll('#theme-btn, #theme-btn-mobile');
    const ripple    = document.getElementById('theme-ripple');
    
    html.setAttribute('data-theme', getThemeSafe());

    themeBtns.forEach(btn => btn.addEventListener('click', (e) => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        
        // Ripple animation
        if (ripple) {
            const rect = btn.getBoundingClientRect();
            ripple.style.left = `${rect.left + rect.width / 2}px`;
            ripple.style.top  = `${rect.top + rect.height / 2}px`;
            ripple.style.background = next === 'dark' ? '#050710' : '#FFFDF7';
            ripple.classList.remove('expanding');
            void ripple.offsetWidth;
            ripple.classList.add('expanding');
        }

        setTimeout(() => {
            html.setAttribute('data-theme', next);
            setThemeSafe(next);
        }, 350);
    }));


    /* ═══════════════════════════════════════════
       2. CURSOR
    ═══════════════════════════════════════════ */
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        if (dot) {
            dot.style.left = `${mx}px`;
            dot.style.top  = `${my}px`;
        }
    });

    (function trackRing() {
        rx += (mx - rx) * .14;
        ry += (my - ry) * .14;
        if (ring) {
            ring.style.left = `${rx}px`;
            ring.style.top  = `${ry}px`;
        }
        requestAnimationFrame(trackRing);
    })();

    document.querySelectorAll('a, button, .proj-trigger, .pill, .chip')
        .forEach(el => {
            el.addEventListener('mouseenter', () =>
                document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () =>
                document.body.classList.remove('hovering'));
        });


    /* ═══════════════════════════════════════════
       3. HERO ENTRANCE
    ═══════════════════════════════════════════ */
    function runHeroEntrance() {
        setTimeout(() => {
            /* Name lines slide up */
            document.querySelectorAll('.nm-line').forEach((line, i) =>
                setTimeout(() =>
                    (line.style.transform = 'translateY(0)'),
                    100 + i * 140
                )
            );

            /* Hero headline words */
            document.querySelectorAll('.hw').forEach((hw, i) =>
                setTimeout(() =>
                    (hw.style.transform = 'translateY(0)'),
                    250 + i * 150
                )
            );

            /* Supporting elements */
            document.querySelectorAll('.h-desc, .h-ctas, .h-bar, .h-eye')
                .forEach((el, i) =>
                    setTimeout(() => el.classList.add('on'), 480 + i * 160)
                );
        }, 80);
    }


    /* ═══════════════════════════════════════════
       4. SCROLL VELOCITY SYSTEM
       Drives marquee speed + heading skew
    ═══════════════════════════════════════════ */
    let lastSY       = 0;
    let velTarget    = 0;
    let vel          = 0;

    /* Marquee state */
    const MQ_BASE  = 1.2;     // px per frame at rest
    let   mqSpeed  = MQ_BASE;
    let   mqX      = 0;
    const mqRowA   = document.getElementById('mq-row-a');

    /* Skew targets — headings + project triggers */
    const skewEls = document.querySelectorAll('.s-head, .ct-head, .proj-trigger');

    /* Track scroll velocity */
    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        velTarget = (sy - lastSY) * 0.18;
        lastSY    = sy;

        /* Nav active update lives here too (see section 6) */
        updateNavActive(sy);
    }, { passive: true });

    /* Velocity decay + apply effects each frame */
    (function velLoop() {
        vel       += (velTarget - vel) * 0.12;
        velTarget *= 0.88;

        /* Marquee speed: base + abs(velocity) */
        mqSpeed = MQ_BASE + Math.abs(vel);

        /* Subtle heading skew on fast scroll */
        const skew = Math.min(Math.max(vel * -0.06, -2.2), 2.2);
        if (Math.abs(skew) > 0.05) {
            skewEls.forEach(el =>
                (el.style.transform = `skewY(${skew}deg)`));
        } else {
            skewEls.forEach(el => {
                if (el.style.transform !== '') el.style.transform = '';
            });
        }

        requestAnimationFrame(velLoop);
    })();

    /* Marquee animation loop */
    let mqHalfW = mqRowA ? mqRowA.scrollWidth / 2 : 0;
    window.addEventListener('resize', () => {
        if (mqRowA) mqHalfW = mqRowA.scrollWidth / 2;
    });

    function animateMarquee() {
        if (!mqRowA) return;
        mqX -= mqSpeed;
        if (Math.abs(mqX) >= mqHalfW) mqX = 0; // seamless reset
        mqRowA.style.transform = `translateX(${mqX}px)`;
        requestAnimationFrame(animateMarquee);
    }
    animateMarquee();


    /* ═══════════════════════════════════════════
       5. HERO PARALLAX (parallax bg num + opacity)
    ═══════════════════════════════════════════ */
    const bgNum    = document.querySelector('.hero-bg-num');
    const heroInner = document.querySelector('.hero-inner');
    let scrollTick2 = false;

    window.addEventListener('scroll', () => {
        if (scrollTick2) return;
        scrollTick2 = true;
        requestAnimationFrame(() => {
            const sy = window.scrollY;
            if (bgNum)     bgNum.style.transform = `translateY(${sy * .07}px)`;
            if (heroInner) {
                const prog = Math.min(sy / (window.innerHeight * .7), 1);
                heroInner.style.opacity   = 1 - prog * .45;
                heroInner.style.transform = `translateY(${sy * .04}px)`;
            }
            scrollTick2 = false;
        });
    }, { passive: true });


    /* ═══════════════════════════════════════════
       6. NAV ACTIVE STATE
    ═══════════════════════════════════════════ */
    const sections     = ['intro', 'work', 'about', 'stack', 'contact'];
    const desktopLinks = document.querySelectorAll('.nav-item');
    const mobileLinks  = document.querySelectorAll('.mn-link');
    let   scrollTick   = false;

    function updateNavActive(sy) {
        if (scrollTick) return;
        scrollTick = true;
        requestAnimationFrame(() => {
            let current = 'intro';
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top < window.innerHeight * .45)
                    current = id;
            });
            [...desktopLinks, ...mobileLinks].forEach(link =>
                link.classList.toggle('active', link.dataset.section === current)
            );
            scrollTick = false;
        });
    }

    /* Initial check */
    window.dispatchEvent(new Event('scroll'));


    /* ═══════════════════════════════════════════
       7. PROJECT ACCORDION with child stagger
    ═══════════════════════════════════════════ */
    const projItems = document.querySelectorAll('.proj-item');
    const ctxPanel  = document.getElementById('ctx-panel');

    if (ctxPanel) {
        const ctxNum  = ctxPanel.querySelector('.ctx-num');
        const ctxType = ctxPanel.querySelector('.ctx-type');
        const ctxName = ctxPanel.querySelector('.ctx-name');

        projItems.forEach(item => {
            const trigger = item.querySelector('.proj-trigger');
            const body    = item.querySelector('.proj-body');
            const inner   = item.querySelector('.proj-body-inner');

            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                /* Close all other items */
                projItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('open');
                        other.querySelector('.proj-body').style.height = '0';
                        /* Reset children of closed item */
                        other.querySelectorAll(
                            '.proj-narrative, .proj-outcome, .proj-stack, .proj-link'
                        ).forEach(child => (child.style.cssText = ''));
                    }
                });

                if (!isOpen) {
                    /* OPEN */
                    item.classList.add('open');
                    body.style.height = `${inner.offsetHeight}px`;

                    /* Context panel update */
                    ctxNum.textContent  = item.dataset.num;
                    ctxType.textContent = item.dataset.type;
                    ctxName.textContent = item.dataset.name;
                    ctxPanel.classList.add('active');

                    /* Stagger children in */
                    const children = inner.querySelectorAll(
                        '.proj-narrative, .proj-outcome, .proj-stack, .proj-link'
                    );
                    children.forEach((child, i) => {
                        child.style.opacity   = '0';
                        child.style.transform = 'translateY(14px)';
                        setTimeout(() => {
                            child.style.transition = [
                                `opacity .5s ${i * 80}ms ease`,
                                `transform .5s ${i * 80}ms cubic-bezier(.16,1,.3,1)`
                            ].join(', ');
                            child.style.opacity   = '1';
                            child.style.transform = 'translateY(0)';
                        }, 60 + i * 80);
                    });

                } else {
                    /* CLOSE */
                    item.classList.remove('open');
                    body.style.height = '0';
                    ctxPanel.classList.remove('active');
                    inner.querySelectorAll(
                        '.proj-narrative, .proj-outcome, .proj-stack, .proj-link'
                    ).forEach(child => (child.style.cssText = ''));
                    setTimeout(() => {
                        if (!document.querySelector('.proj-item.open')) {
                            ctxNum.textContent  = '—';
                            ctxType.textContent = 'Project Type';
                            ctxName.textContent = 'Project Title';
                        }
                    }, 400);
                }
            });
        });
    }


    /* ═══════════════════════════════════════════
       8. MOBILE NAV
    ═══════════════════════════════════════════ */
    const mnToggle = document.getElementById('mn-toggle');
    const mnLinks  = document.getElementById('mn-links');
    if (mnToggle && mnLinks) {
        mnToggle.addEventListener('click', () => {
            mnToggle.classList.toggle('open');
            mnLinks.classList.toggle('open');
        });
        mnLinks.querySelectorAll('.mn-link').forEach(link =>
            link.addEventListener('click', () => {
                mnToggle.classList.remove('open');
                mnLinks.classList.remove('open');
            })
        );
    }


    /* ═══════════════════════════════════════════
       9. PILL / CHIP MAGNETIC HOVER
    ═══════════════════════════════════════════ */
    document.querySelectorAll('.pill, .chip').forEach(pill => {
        pill.addEventListener('mousemove', e => {
            const rect = pill.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const dx   = (e.clientX - cx) / rect.width;
            const dy   = (e.clientY - cy) / rect.height;
            pill.style.transform =
                `translateY(-2px) translate(${dx * 4}px, ${dy * 3}px)`;
        });
        pill.addEventListener('mouseleave', () =>
            (pill.style.transform = '')
        );
    });


    /* ═══════════════════════════════════════════
       10. CONTACT FORM
    ═══════════════════════════════════════════ */
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn  = form.querySelector('button');
            const orig = btn.textContent;
            btn.textContent   = 'Sending…';
            btn.style.opacity = '.7';
            setTimeout(() => {
                btn.textContent       = 'Message Sent ✓';
                btn.style.background  = '#4ade80';
                btn.style.color       = '#0B0D12';
                btn.style.opacity     = '1';
                form.reset();
                setTimeout(() => {
                    btn.textContent      = orig;
                    btn.style.background = '';
                    btn.style.color      = '';
                }, 3200);
            }, 1500);
        });
    }


    /* ═══════════════════════════════════════════
       11. SCROLL REVEAL SYSTEM
       Initialised AFTER loader exits
    ═══════════════════════════════════════════ */
    function initScrollObservers() {
        const revealObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el    = entry.target;
                const delay = parseInt(el.dataset.delay) || 0;

                setTimeout(() => {
                    el.classList.add('on');

                    /* Pill wave animation per-row */
                    if (el.classList.contains('sk-row')) {
                        el.querySelectorAll('.pill').forEach((pill, i) => {
                            pill.style.animation = 'none';
                            pill.style.opacity   = '0';
                            pill.style.transform = 'translateY(10px) scale(.85)';
                            setTimeout(() => {
                                pill.style.transition = [
                                    `opacity .4s ${i * 38}ms var(--easing)`,
                                    `transform .4s ${i * 38}ms cubic-bezier(.34,1.56,.64,1)`
                                ].join(', ');
                                pill.style.opacity   = '1';
                                pill.style.transform = '';
                            }, 80 + i * 38);
                        });
                    }

                    /* h-bar stagger */
                    if (el.classList.contains('h-bar')) {
                        el.querySelectorAll('.hb-value').forEach((val, i) => {
                            val.style.opacity   = '0';
                            val.style.transform = 'translateY(12px)';
                            setTimeout(() => {
                                val.style.transition =
                                    'opacity .6s ease, transform .6s cubic-bezier(.16,1,.3,1)';
                                val.style.opacity   = '1';
                                val.style.transform = '';
                            }, 200 + i * 120);
                        });
                    }
                }, delay);

                revealObs.unobserve(el);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.rv').forEach(el => revealObs.observe(el));

        /* Section transition — accent ripple when in about */
        const aboutSec = document.getElementById('about');
        const lpPanel  = document.getElementById('left-panel');
        if (aboutSec) {
            const aboutObs = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    lpPanel?.classList.toggle('in-about', entry.isIntersecting);
                });
            }, { threshold: .3 });
            aboutObs.observe(aboutSec);
        }
    }


    /* ═══════════════════════════════════════════
       12. WORD-SPLIT SECTION HEADING REVEAL
       Lusion-style word-by-word emergence
    ═══════════════════════════════════════════ */
    function initWordSplitReveal() {
        function wrapWords(el) {
            /* Preserve accent-txt spans by working with childNodes */
            const processed = [];
            const nodes = Array.from(el.childNodes);
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const words = node.textContent.split(' ');
                    words.forEach((w, i) => {
                        if (!w.trim()) return;
                        const outer = document.createElement('span');
                        outer.className = 'word-outer';
                        const inner = document.createElement('span');
                        inner.className = 'word-inner';
                        inner.textContent = w;
                        outer.appendChild(inner);
                        processed.push({ node, outer, insert: true });
                        el.insertBefore(outer, node);
                        if (i < words.length - 1) {
                            el.insertBefore(document.createTextNode(' '), node);
                        }
                    });
                    el.removeChild(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    /* Wrap the element's text content */
                    const outer = document.createElement('span');
                    outer.className = 'word-outer';
                    const inner = document.createElement('span');
                    inner.className = 'word-inner';
                    /* Move element inside inner */
                    inner.appendChild(node.cloneNode(true));
                    outer.appendChild(inner);
                    processed.push({ node, outer, insert: true });
                    el.insertBefore(outer, node);
                    el.removeChild(node);
                }
            });
        }

        const wordHeads = document.querySelectorAll('.s-head, .ct-head');

        const wordObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const inners = entry.target.querySelectorAll('.word-inner');
                inners.forEach((w, i) => {
                    setTimeout(() => {
                        w.style.transition =
                            `transform .78s cubic-bezier(.16,1,.3,1)`;
                        w.style.transform  = 'translateY(0)';
                    }, i * 85);
                });
                wordObs.unobserve(entry.target);
            });
        }, { threshold: .2 });

        wordHeads.forEach(el => {
            wrapWords(el);
            el.querySelectorAll('.word-inner')
                .forEach(w => (w.style.transform = 'translateY(110%)'));
            wordObs.observe(el);
        });
    }


    /* ═══════════════════════════════════════════
       13. ROTATING TEXT IN CONTACT
    ═══════════════════════════════════════════ */
    function initRotatingText() {
        const rotWords = [
            'something.',
            'systems.',
            'solutions.',
            'the future.',
            'together.',
            'real things.',
        ];
        let rwIdx   = 0;
        const rwEl  = document.getElementById('rotating-word');
        if (!rwEl) return;

        let rwInterval = null;

        function nextWord() {
            /* Exit current word upward */
            rwEl.classList.add('rw-exit');

            setTimeout(() => {
                rwIdx = (rwIdx + 1) % rotWords.length;
                rwEl.textContent = rotWords[rwIdx];

                /* Snap to bottom without transition */
                rwEl.classList.remove('rw-exit');
                rwEl.classList.add('rw-enter');

                /* Force reflow so browser registers the class change */
                void rwEl.offsetHeight;

                /* Animate up into position */
                rwEl.classList.remove('rw-enter');
                rwEl.classList.add('rw-active');

                setTimeout(() => rwEl.classList.remove('rw-active'), 500);
            }, 280);
        }

        /* Only rotate when contact section is visible */
        const contactEl = document.getElementById('contact');
        if (contactEl) {
            const rwObs = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting && !rwInterval) {
                        rwInterval = setInterval(nextWord, 2400);
                    } else if (!e.isIntersecting && rwInterval) {
                        clearInterval(rwInterval);
                        rwInterval = null;
                    }
                });
            }, { threshold: .25 });
            rwObs.observe(contactEl);
        }
    }


    /* ═══════════════════════════════════════════
       14. FOOTER ENTRANCE ANIMATION
    ═══════════════════════════════════════════ */
    function initFooterAnimation() {
        const footerEl = document.querySelector('footer');
        if (!footerEl) return;

        const footerObs = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) return;

            const logo = footerEl.querySelector(':first-child');
            const copy = footerEl.querySelector('.f-copy');

            logo?.animate(
                [{ opacity: 0, transform: 'translateX(-20px)' },
                 { opacity: 1, transform: 'translateX(0)' }],
                { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }
            );

            copy?.animate(
                [{ opacity: 0, transform: 'translateX(20px)' },
                 { opacity: 1, transform: 'translateX(0)' }],
                { duration: 600, delay: 120, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }
            );

            footerObs.unobserve(footerEl);
        }, { threshold: .5 });

        footerObs.observe(footerEl);
    }


    /* ═══════════════════════════════════════════
       15. PILL ROW WAVE OBSERVER (separate observer
       for skill rows to fire pill wave animation)
    ═══════════════════════════════════════════ */
    const pillRowObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.pill').forEach((pill, i) => {
                pill.style.opacity   = '0';
                pill.style.transform = 'translateY(10px) scale(.85)';
                setTimeout(() => {
                    pill.style.transition = [
                        `opacity .4s ${i * 38}ms var(--easing)`,
                        `transform .4s ${i * 38}ms cubic-bezier(.34,1.56,.64,1)`
                    ].join(', ');
                    pill.style.opacity   = '1';
                    pill.style.transform = '';
                }, 50 + i * 38);
            });
            pillRowObs.unobserve(entry.target);
        });
    }, { threshold: .3 });

    /* ═══════════════════════════════════════════
       16. STICKY SECTION NUMBER
    ═══════════════════════════════════════════ */
    function initStickySection() {
        const stickyEl = document.getElementById('sticky-num');
        const numEl    = stickyEl?.querySelector('.ssn-num');
        const sections = document.querySelectorAll('section[data-sec-num]');
        
        const stickyObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    if (numEl) numEl.textContent = e.target.dataset.secNum;
                    stickyEl?.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        sections.forEach(s => stickyObs.observe(s));
    }

    /* ═══════════════════════════════════════════
       17. IMPACT STATS COUNT-UP
    ═══════════════════════════════════════════ */
    function initImpactStats() {
        const stats = document.querySelectorAll('.impact-num');
        const statsObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const target = parseInt(el.dataset.count);
                    let curr = 0;
                    const dur = 1500;
                    const start = performance.now();

                    function step(now) {
                        const prog = Math.min((now - start) / dur, 1);
                        const val = Math.floor(prog * target);
                        el.textContent = String(val).padStart(2, '0');
                        if (prog < 1) requestAnimationFrame(step);
                        else el.textContent = String(target).padStart(2, '0');
                    }
                    requestAnimationFrame(step);
                    statsObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(s => statsObs.observe(s));
    }

    /* ═══════════════════════════════════════════
       18. SECTION FLASH
    ═══════════════════════════════════════════ */
    function initSectionFlashes() {
        const sections = document.querySelectorAll('section');
        const flashObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const flash = e.target.querySelector('.section-flash');
                    if (flash) {
                        flash.classList.remove('flash');
                        void flash.offsetWidth;
                        flash.classList.add('flash');
                    }
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(s => flashObs.observe(s));
    }

    /* ═══════════════════════════════════════════
       19. QUOTE WORD SPLIT REVEAL
    ═══════════════════════════════════════════ */
    function initQuoteParallax() {
        const quoteWall = document.querySelector('.quote-wall');
        const quoteText = document.querySelector('.qw-text');
        if (!quoteWall || !quoteText || quoteWall.dataset.splitDone) return;

        // Split text into words for staggered reveal
        const text = quoteText.textContent.trim();
        quoteText.innerHTML = text.split(/\s+/).map((word, i) => 
            `<span class="qw-word" style="--i: ${i}">${word}</span>`
        ).join(' ');
        
        quoteWall.dataset.splitDone = "true";
    }

    /* ═══════════════════════════════════════════
       20. DOCUMENTATION MODAL
    ═══════════════════════════════════════════ */
    function initDocModal() {

        /* ── Project data (sourced from actual project READMEs & codebases) ── */
        const projectData = {
            'yt-shorts': {
                num: '01',
                type: 'Cloud & Automation Engineering',
                title: 'YouTube Shorts Automation',
                status: 'Live',
                role: 'Solo Developer',
                timeline: '2026',
                repoUrl: 'https://github.com/Hazy019/youtube-shorts-automation',
                liveUrl: 'https://shortsautomations.vercel.app/',
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
                stack: ['Python 3.12', 'Google Gemini 3 Flash', 'Microsoft Edge-TTS', 'Remotion (React)', 'AWS Lambda', 'AWS S3', 'Supabase', 'Discord Webhooks', 'GitHub Actions'],
                devnotes: 'The system uses two critical performance optimizations: High-Performance Offthread Rendering and Proportional Video Segment Trimming. Headless Chrome (Puppeteer) in Lambda does not support hardware acceleration; loading multiple HTML5 video elements triggers massive bottlenecks. We use OffthreadVideo, running native FFmpeg inside the container to extract frames as images and inject them into canvas, saving 85% memory. To save S3 bandwidth, src/media/assets.py calculates the frame budget dynamically so we only trim and download what we need, not the full source clips.',
                outcome: 'Achieves 100% hands-off daily content creation scheduled around prime social traffic. Features a local JSON failsafe recovery layer and stateful Supabase fallback, detecting aborted runs and resuming from cache without burning the Gemini API budget. Simulated parallel rendering is 5-10x faster than cloud CPU rendering.'
            },
            'dti-queue': {
                num: '02',
                type: 'Government Infrastructure',
                title: 'DTI Queue System',
                status: 'Production',
                role: 'Lead Developer',
                timeline: '2026',
                problem: 'The DTI Payment Office managed walk-in client flow with paper ticket slips, a whiteboard, and verbal call-outs. There was no audit trail, no way to measure wait times, no mechanism to handle multiple service lanes simultaneously, and no visibility for clients on where they stood in the queue. During peak hours, the system broke down entirely.',
                solution: 'A self-hosted, LAN-based smart queue management system with four purpose-built interfaces: a customer Kiosk for ticket issuance, a Cashier dashboard for queue management, a public Monitor display, and an Admin panel for lane configuration and analytics. No internet required — runs on a single office PC and serves all devices over the office LAN.',
                steps: [
                    'Customer walks up to the Kiosk (/kiosk), selects service type, and receives a printed thermal ticket (80mm format)',
                    'Socket.io broadcasts the new ticket to all connected dashboards in real time — cashier sees it instantly',
                    'Cashier (/cashier) calls the next ticket, marking each transaction as called, serving, or done via their dashboard',
                    'Public Monitor (/monitor) displays the live now-serving number on a TV screen in the waiting area',
                    'Admin (/admin) configures lanes, manages cashier accounts, and views daily queue analytics — tickets auto-reset at midnight via node-cron'
                ],
                specs: [
                    { label: 'Deployment', value: 'Self-Hosted LAN (No Internet)' },
                    { label: 'Interfaces', value: 'Kiosk · Cashier · Monitor · Admin' },
                    { label: 'Database', value: 'SQLite via Prisma ORM' },
                    { label: 'Printer', value: '80mm Thermal (Auto-Print)' }
                ],
                stack: ['Node.js', 'Express.js', 'Socket.io', 'Prisma ORM', 'SQLite', 'React (Vite)', 'JWT', 'bcryptjs', 'Helmet', 'node-cron'],
                devnotes: 'The biggest constraint was reliability on aging office hardware with no IT staff on-site. I chose SQLite over PostgreSQL specifically because it requires zero server setup — a single .db file, no service to manage, no credentials to lose. Prisma handles migrations cleanly. The Socket.io reconnection logic was the most critical piece: office routers drop connections intermittently, so every client implements exponential backoff with a persistent connection state indicator so staff always know if they are live.',
                outcome: 'Paper slips were eliminated on day one. All four interfaces deployed across the office LAN on existing hardware — the kiosk PC, cashier stations, and a public monitor TV — with no configuration required from office staff. The system has been in daily production use with zero reported failures. A batch script handles startup so any staff member can launch the full system.'
            },
            'polycon': {
                num: '03',
                type: 'Academic Platform',
                title: 'Polycon — A Consultation System',
                status: 'Live',
                role: 'Full-Stack Developer',
                timeline: '2024-2026',
                repoUrl: 'https://github.com/xenhusk/POLYCON',
                problem: 'Faculty-student consultations at the polytechnic were entirely unstructured. Bookings were made via text message, sessions were undocumented, grade improvement was unmeasured, and there was no way to determine whether consultations were actually helping students. Faculty had no visibility into their own schedule, and administrators had no data on consultation effectiveness.',
                solution: 'Polycon — a full-stack educational consultation and learning management system. Students book sessions through a scheduling interface, faculty manage availability and session notes, and an analytics engine (the POLYCON Analysis) statistically measures the effect of consultation frequency on grade improvement across Prelim, Midterm, Pre-Final, and Final periods. Sessions can be audio-recorded and auto-transcribed via AssemblyAI.',
                steps: [
                    'Student authenticates via JWT and views real-time faculty availability through the booking calendar',
                    'Booking request triggers a Flask-SocketIO event — faculty receives an instant notification',
                    'Faculty accepts or reschedules; APScheduler sends reminder emails before the session',
                    'During or after the session, faculty fills a structured consultation form; audio recordings are transcribed by AssemblyAI and AI-sentiment-analyzed via Google Generative AI',
                    'Admin dashboard runs POLYCON Analysis — a statistical report correlating consultation count with grade delta across academic periods — exportable as a PDF'
                ],
                specs: [
                    { label: 'Analytics', value: 'POLYCON Analysis (Grade vs Consultation)' },
                    { label: 'Transcription', value: 'AssemblyAI (Audio-to-Text)' },
                    { label: 'Deployment', value: 'Render.com + Docker' },
                    { label: 'Access Control', value: 'Student · Faculty · Admin (JWT)' }
                ],
                stack: ['Flask (Python 3.11)', 'React 18', 'PostgreSQL', 'Flask-SocketIO', 'SQLAlchemy', 'JWT', 'APScheduler', 'AssemblyAI', 'Google Generative AI', 'Chart.js', 'Tailwind CSS', 'Framer Motion', 'Docker'],
                devnotes: 'The POLYCON Analysis module was the most research-heavy part — I had to define a statistically meaningful way to measure consultation effectiveness on grades. I landed on computing the grade delta per student (pre vs post consultation period) and correlating it with session count. The AI sentiment analysis on transcribed sessions was added to give faculty qualitative feedback on session quality, not just attendance. Deploying on Render with Docker meant designing the app to be fully environment-agnostic from day one.',
                outcome: 'Zero missed appointments since deployment — all session history is now searchable and timestamped. The POLYCON Analysis has produced actual academic reports used by faculty to justify consultation scheduling policies. Audio transcription means no consultation is ever lost to memory. The backup SQL export contains real session data from production use.'
            },
            'spell-gate': {
                num: '04',
                type: 'UX & System Engineering',
                title: 'SpellGate — Screen-Time Kiosk',
                status: 'Production',
                role: 'Solo Developer',
                timeline: '2025-2026',
                repoUrl: 'https://github.com/Hazy019/SpellGate',
                liveUrl: 'https://spellgate-eb1e8.web.app/',
                problem: 'Children have unlimited, unmonitored screen time, which often cuts into educational study. Traditional parental controls feel restrictive or punitive, rather than educational, and lack real-time control features for parents who want to monitor progress and adjust rewards dynamically.',
                solution: 'SpellGate gamifies spelling by intercepting screen-time behind a hardware kiosk-mode lock screen (PyQt6 on Windows). To earn playtime, children must complete spelling challenges generated by Google Gemini AI (with offline dictionary backup). Parents monitor activity and issue remote unlocks in real time via a web dashboard (React, Vite, Firebase Firestore).',
                steps: [
                    'PyQt6 kiosk locks the Windows shell environment (disabling Alt-Tab, Windows key, and Task Manager via registry/watchdog)',
                    'Built-in TTS reads spelling words; child inputs answers, and Gemini AI validates spelling and generates contextual sentences',
                    'If offline, the system falls back seamlessly to a local JSON library of 150+ curated spelling words and sentences',
                    'Earned playtime is stored in a locally persisted JSON bank (preserving time across system restarts)',
                    'Kiosk pushes session progress, accuracy, and playtime remaining to Firebase Firestore; parent dashboard receives live updates and supports remote force-unlock'
                ],
                specs: [
                    { label: 'Kiosk Security', value: 'Alt-Tab/TaskMgr Lockdown + Watchdog Daemon' },
                    { label: 'Parent Link', value: '6-digit Pairing Code + Firebase Real-time Sync' },
                    { label: 'AI Engine', value: 'Gemini Cascade (Offline CURATED Fallback)' },
                    { label: 'Data Bank', value: 'C:\\Users\\[User]\\AppData\\Local\\SpellGate (SQLite)' }
                ],
                stack: ['Python 3.12', 'PyQt6', 'React', 'Vite', 'Firebase Firestore', 'Google Gemini AI', 'Keyring API', 'Inno Setup'],
                devnotes: 'The most complex part of the desktop app was the secure kiosk environment. Children are creative: they will attempt to crash Python with Alt+F4 or close PyQt6 via Task Manager. I resolved this by writing a separate watchdog.py background daemon that runs as a system process, monitors the main kiosk status, and auto-spawns it if killed. Keys and API credentials are kept safe by retrieving them at runtime via Keyring from the Windows OS credential manager, never packaging them in PyInstaller.',
                outcome: 'Successfully restricts Windows shell environments on startup. Spaced repetition features (injecting mastered words back into the daily pool) improves long-term spelling retention by 40% in demo trials. Parents have 100% remote force-unlock capability with under 500ms latency via Firestore onSnapshot listeners.'
            },
            'sentinel-view': {
                num: '05',
                type: 'Cybersecurity Engineering',
                title: 'SentinelView — Threat Visualiser',
                status: 'Live Demo',
                role: 'Solo Developer',
                timeline: '2026',
                repoUrl: 'https://github.com/Hazy019/SentinelView',
                problem: 'A lack of accessible, real-time visual tools for monitoring pattern-based network security alerts. Modern SIEMs are complex and lack visual context, while demo threat dashboards either rely on static mock data or hide authentication and database constraints, making them poor representations of actual production pipelines.',
                solution: 'SentinelView simulates real-time network log ingestion and processes threat rules locally. A FastAPI backend processes logs in memory via a single uvicorn worker, detecting brute-force attempts, port scans, and data exfiltration in real-time. Alerts are pushed via WebSockets (with REST fallback) to a Next.js frontend, animating a glassmorphic dashboard and a 3D Three.js attack globe.',
                steps: [
                    'Python log generator pushes synthetic network logs to the FastAPI backend API',
                    'FastAPI consumes events and runs deterministic rule matching (sliding-window IP tracking, byte thresholds)',
                    'Active threat matches trigger alerts, which are archived in SQLite (WAL mode) and pushed via WebSockets',
                    'WebSocket connection authorizes users via a one-time tickets exchange (UUID v4, 30s TTL) for secure token-free socket auth',
                    'Next.js UI renders the alerts on a 3D R3F/Three.js attack globe and logs them in a live alerting dashboard'
                ],
                specs: [
                    { label: 'Threat Logic', value: 'Deterministic Sliding-Window Rules' },
                    { label: 'Session Security', value: 'React-Memory JWT + One-Time Ticket WebSocket Auth' },
                    { label: 'DB Architecture', value: 'SQLite WAL Mode (Render Ephemeral Disk)' },
                    { label: 'Visualization', value: 'Three.js / React Three Fiber Globe' }
                ],
                stack: ['FastAPI', 'WebSockets', 'Next.js 14', 'TypeScript', 'React Three Fiber', 'Three.js', 'SQLite (WAL Mode)', 'Tailwind CSS', 'Framer Motion'],
                devnotes: 'The primary architectural challenge was managing session persistence securely without localStorage. JWTs are kept in React memory only; a page refresh wipes them, preventing credential harvesting. WebSocket authentication uses a one-time ticket system (30s TTL) so the JWT is never leaked in URLs. Horizontal scaling was intentionally omitted due to backend in-memory state tracking for brute-force sliding-windows; multiple processes would lead to false-negatives without a central store like Redis.',
                outcome: 'Successfully visualizes brute-force attacks (>5 failed logins from an IP in 10s), port scans (>10 distinct IPs in 5s), and data exfiltration (>10MB transfer). The dashboard maintains a Connecting skeleton state to gracefully handle Render.com free-tier cold starts, and utilizes SQLite WAL mode to support high-speed read/write logs concurrent access.'
            }
        };

        /* ── DOM refs ── */
        const modal         = document.getElementById('doc-modal');
        const backdrop      = modal?.querySelector('.doc-modal-backdrop');
        const closeBtn      = document.getElementById('doc-modal-close');
        const elNum         = document.getElementById('doc-modal-num');
        const elType        = document.getElementById('doc-modal-type');
        const elTitle       = document.getElementById('doc-modal-title');
        const elStatus      = document.getElementById('doc-badge-status');
        const elRole        = document.getElementById('doc-badge-role');
        const elTimeline    = document.getElementById('doc-badge-timeline');
        const elProblem     = document.getElementById('doc-problem');
        const elSolution    = document.getElementById('doc-solution');
        const elSteps       = document.getElementById('doc-steps');
        const elSpecsGrid   = document.getElementById('doc-specs-grid');
        const elChips       = document.getElementById('doc-chips');
        const elDevnotes    = document.getElementById('doc-devnotes');
        const elOutcome     = document.getElementById('doc-outcome');

        // Progress, Actions, Footer elements
        const elProgressBar = document.getElementById('doc-modal-progress');
        const elActions     = document.getElementById('doc-modal-actions');
        const elPrevBtn     = document.getElementById('doc-prev-btn');
        const elNextBtn     = document.getElementById('doc-next-btn');
        const elPrevTitle   = document.getElementById('doc-prev-title');
        const elNextTitle   = document.getElementById('doc-next-title');

        if (!modal) return;

        /* ── Open modal ── */
        function openModal(projectId) {
            const data = projectData[projectId];
            if (!data) return;

            /* Populate fields */
            elNum.textContent      = data.num;
            elType.textContent     = data.type;
            elTitle.textContent    = data.title;
            elStatus.textContent   = data.status;
            elRole.textContent     = data.role;
            elTimeline.textContent = data.timeline;
            elProblem.textContent  = data.problem;
            elSolution.textContent = data.solution;
            elDevnotes.textContent = data.devnotes;
            elOutcome.textContent  = data.outcome;

            /* Steps */
            elSteps.innerHTML = data.steps
                .map((s, i) => `<li><span class="doc-step-num">${String(i+1).padStart(2,'0')}</span><span>${s}</span></li>`)
                .join('');

            /* Spec cards */
            elSpecsGrid.innerHTML = data.specs
                .map(s => `<div class="doc-spec-card"><div class="doc-spec-label">${s.label}</div><div class="doc-spec-value">${s.value}</div></div>`)
                .join('');

            /* Tech chips */
            elChips.innerHTML = data.stack
                .map(t => `<span class="doc-chip">${t}</span>`)
                .join('');

            /* Status badge color */
            elStatus.dataset.status = data.status.toLowerCase();

            /* Project Action CTAs (Live Demo / Code Source) */
            if (elActions) {
                elActions.innerHTML = '';
                if (data.liveUrl) {
                    elActions.innerHTML += `
                        <a href="${data.liveUrl}" target="_blank" class="doc-action-btn doc-action-btn--live">
                            <span>Visit Live Demo</span>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                    `;
                }
                if (data.repoUrl) {
                    elActions.innerHTML += `
                        <a href="${data.repoUrl}" target="_blank" class="doc-action-btn doc-action-btn--code">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            <span>Source Code</span>
                        </a>
                    `;
                }
            }

            /* Previous / Next Navigation */
            const keys = Object.keys(projectData);
            const idx = keys.indexOf(projectId);
            const prevKey = keys[(idx - 1 + keys.length) % keys.length];
            const nextKey = keys[(idx + 1) % keys.length];

            if (elPrevTitle) elPrevTitle.textContent = projectData[prevKey].title;
            if (elNextTitle) elNextTitle.textContent = projectData[nextKey].title;
            if (elPrevBtn) elPrevBtn.dataset.project = prevKey;
            if (elNextBtn) elNextBtn.dataset.project = nextKey;

            /* Show */
            modal.classList.add('open');
            document.body.classList.add('modal-open');

            /* Scroll modal body to top & Reset progress */
            const panel = modal.querySelector('.doc-modal-panel');
            if (panel) {
                panel.scrollTop = 0;
                if (elProgressBar) elProgressBar.style.width = '0%';
            }

            /* Stagger-animate sections in */
            const sections = modal.querySelectorAll('.doc-section, .doc-specs-grid, .doc-modal-actions, .doc-modal-footer');
            sections.forEach((sec, i) => {
                sec.style.opacity   = '0';
                sec.style.transform = 'translateY(22px)';
                setTimeout(() => {
                    sec.style.transition = `opacity .55s ${i * 70}ms ease, transform .55s ${i * 70}ms cubic-bezier(.16,1,.3,1)`;
                    sec.style.opacity   = '1';
                    sec.style.transform = 'translateY(0)';
                }, 80 + i * 70);
            });
        }

        /* ── Close modal ── */
        function closeModal() {
            modal.classList.remove('open');
            document.body.classList.remove('modal-open');
        }

        /* ── Triggers ── */
        document.querySelectorAll('.doc-trigger').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                openModal(link.dataset.project);
            });
        });

        closeBtn?.addEventListener('click', closeModal);
        backdrop?.addEventListener('click', closeModal);

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });

        /* ── Footer Prev/Next Click Switch ── */
        [elPrevBtn, elNextBtn].forEach(btn => {
            btn?.addEventListener('click', () => {
                const targetProject = btn.dataset.project;
                if (!targetProject) return;

                const panel = modal.querySelector('.doc-modal-panel');
                if (panel) {
                    panel.style.opacity = '0';
                    panel.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        openModal(targetProject);
                        panel.style.transition = 'opacity .4s ease, transform .4s var(--easing)';
                        panel.style.opacity = '1';
                        panel.style.transform = 'translateX(0)';
                    }, 220);
                } else {
                    openModal(targetProject);
                }
            });
        });

        /* ── Scroll Reading Progress Bar ── */
        const panel = modal.querySelector('.doc-modal-panel');
        if (panel && elProgressBar) {
            panel.addEventListener('scroll', () => {
                const maxScroll = panel.scrollHeight - panel.clientHeight;
                const pct = maxScroll > 0 ? (panel.scrollTop / maxScroll) * 100 : 0;
                elProgressBar.style.width = `${pct}%`;
            });
        }
    }
});