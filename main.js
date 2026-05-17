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


    /* ═══════════════════════════════════════════
       1. THEME RIPPLE TOGGLE
    ═══════════════════════════════════════════ */
    const html      = document.documentElement;
    const themeBtns = document.querySelectorAll('#theme-btn, #theme-btn-mobile');
    const ripple    = document.getElementById('theme-ripple');
    
    html.setAttribute('data-theme', localStorage.getItem('hazy-theme') || 'dark');

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
            localStorage.setItem('hazy-theme', next);
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
        dot.style.left = `${mx}px`;
        dot.style.top  = `${my}px`;
    });

    (function trackRing() {
        rx += (mx - rx) * .14;
        ry += (my - ry) * .14;
        ring.style.left = `${rx}px`;
        ring.style.top  = `${ry}px`;
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
            el.childNodes.forEach(node => {
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
                type: 'Automation Engineering',
                title: 'YouTube Shorts Automator',
                status: 'Live',
                role: 'Solo Developer',
                timeline: '2024',
                problem: 'Creating short-form content at scale requires generating scripts, recording voiceovers, sourcing B-roll, rendering video, syncing captions, and uploading to multiple platforms — every single day. Doing this manually for two independent channels (Hazy Insight and Hazy US) was unsustainable and would require a full production team.',
                solution: 'Hazy Content Factory — an enterprise-grade, cloud-native automated video production pipeline. It uses LLMs to generate structured "Viral Package" scripts, neural TTS for voiceover, programmatic video rendering via Remotion on AWS Lambda, and parallel upload to YouTube, TikTok, and Meta. A Supabase-backed recovery system auto-resumes failed renders so no job is ever lost.',
                steps: [
                    'Gemini Flash synthesizes a structured Viral Package JSON from topic input — script, title, description, tags, hook',
                    'Microsoft Edge-TTS generates neural speech audio with word-boundary timestamps for caption sync',
                    'Pexels / Pixabay / AI archive sourced B-roll is matched to script segments hierarchically',
                    'Remotion (React) renders the video programmatically with Ken Burns zoom/drift and word-level karaoke captions — dispatched to AWS Lambda',
                    'Finished render is uploaded in parallel to YouTube, TikTok, and Meta with platform-specific metadata',
                    'Discord webhook fires a telemetry alert with performance metrics per completed run'
                ],
                specs: [
                    { label: 'Channels', value: 'Hazy Insight + Hazy US' },
                    { label: 'Rendering', value: 'AWS Lambda / S3 (Serverless)' },
                    { label: 'State Management', value: 'Supabase (PostgreSQL)' },
                    { label: 'Output', value: 'YouTube · TikTok · Meta' }
                ],
                stack: ['Python 3.12', 'Google Gemini Flash', 'Microsoft Edge-TTS', 'Remotion (React)', 'AWS Lambda', 'AWS S3', 'Supabase', 'PostgreSQL', 'Pexels API', 'Discord Webhooks'],
                devnotes: 'The hardest engineering problem was word-level caption sync. Edge-TTS returns word boundary events with millisecond precision — I built a mapper that converts those timestamps into Remotion frame numbers so every word highlights exactly as it is spoken. The self-healing recovery system was built after a Lambda timeout cascade lost an entire batch; Supabase now tracks job state at every stage and a recovery script re-queues any failed renders on the next run without human intervention.',
                outcome: 'Two fully independent content channels run on complete autopilot. The pipeline scales from 1 to 100 videos per run without any local hardware — AWS Lambda handles parallel rendering across chunks. Anti-AI-slop prompt engineering was introduced after early content sounded robotic; specialized prompts now eliminate repetitive hooks and generic vocabulary, meaningfully improving viewer retention.'
            },
            'dti-queue': {
                num: '02',
                type: 'Government Infrastructure',
                title: 'DTI Queue System',
                status: 'Production',
                role: 'Lead Developer',
                timeline: '2024',
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
                timeline: '2023–2024',
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
                type: 'UX Engineering',
                title: 'Spell Gate',
                status: 'Deployed',
                role: 'Solo Developer',
                timeline: '2023',
                problem: 'A public-facing kiosk deployed for non-technical walk-up users had a data quality problem: users submitted free-text entries with misspellings that corrupted downstream records and required manual correction by staff daily. The device ran air-gapped on a local network with no internet access, ruling out cloud-based spell-check APIs. Staff time spent fixing bad inputs was significant.',
                solution: 'Spell Gate — a Tkinter-based kiosk application with a real-time offline spell-check validation layer built directly into the input flow. Every text field validates tokens against a local dictionary as the user types. Misspelled words surface an inline suggestion interface. The submit action is hard-locked behind a validation pass — users cannot proceed until input is confirmed correct. An admin panel lets non-technical staff configure the vocabulary whitelist and gate strictness without developer involvement.',
                steps: [
                    'User approaches the kiosk and begins typing into any text field',
                    'pyspellchecker tokenizes the input in real time and checks each word against the local dictionary',
                    'Misspelled tokens are underlined and a correction suggestion appears inline without blocking the cursor',
                    'The submit button remains disabled until all fields pass validation — the gate',
                    'Confirmed submissions are written to SQLite; the admin panel allows whitelisting domain-specific terms and adjusting gate rules'
                ],
                specs: [
                    { label: 'Deployment', value: 'Air-Gapped Hardware Kiosk' },
                    { label: 'Validation', value: 'Offline / Local Dictionary' },
                    { label: 'Interface', value: 'Tkinter + Custom Canvas Layer' },
                    { label: 'Admin Panel', value: 'Vocab Whitelist + Gate Config' }
                ],
                stack: ['Python 3', 'Tkinter', 'pyspellchecker', 'SQLite', 'Custom UI Canvas Engine'],
                devnotes: 'Tkinter\'s widget model is not designed for dynamic inline overlays — the standard Entry widget has no native support for per-token styling. I built a custom canvas layer that sits over the entry widget, renders underline markers on misspelled token positions, and intercepts click events on suggestions without interfering with normal typing. The admin vocab whitelist feature was a post-deployment addition requested by staff who needed to whitelist proper nouns specific to their context — I\'m glad the architecture was clean enough to support it with minimal changes.',
                outcome: 'Input error rate dropped to near-zero after deployment. Staff reported that the manual correction workload — which had been a daily task — was eliminated entirely. Users complete the kiosk flow fully unassisted. The admin vocab whitelist has been updated by non-technical staff on their own, validating the design decision to make configuration accessible without code changes.'
            },
            'streamer-shorts': {
                num: '05',
                type: 'Content Automation',
                title: 'Streamer Shorts Automator',
                status: 'Beta',
                role: 'Solo Developer',
                timeline: '2024',
                problem: 'Streamers produce hours of VOD content daily, but extracting viral short-form clips requires watching recordings, identifying high-engagement moments, trimming, reformatting to vertical 9:16, adding captions, and uploading — a process that takes 2–4 hours per clip. Cloud-based solutions were blocked by platform anti-scraping measures at datacenter IP ranges, making server-based automation unreliable.',
                solution: 'A local-residential-hardware pipeline that solves the cloud IP reputation problem. The frontend dashboard (Next.js 14, hosted on Vercel) injects clip jobs into a local SQLite database. A local worker (FastAPI + yt-dlp) runs on home hardware with residential IP reputation, bypassing YouTube\'s datacenter firewall. Gemini 2.5 Flash brainstorms the best clip segments, FFmpeg v11 handles the filtergraph rendering with GPU acceleration (NVENC/AMF), and finished clips are queued for upload.',
                steps: [
                    'Operator submits a VOD URL through the Next.js dashboard on Vercel — job is written to local SQLite via the bridge',
                    'The local worker (FastAPI) picks up the job; yt-dlp downloads the VOD from the residential IP, bypassing cloud scraping blocks',
                    'Gemini 2.5 Flash analyzes the transcript and brainstorms the highest-retention clip segments with rationale',
                    'FFmpeg v11 filtergraph crops to 9:16, applies NVENC/AMF GPU encoding for 5–10x faster rendering than cloud CPU',
                    'Clip is captioned and added to the upload review queue; operator approves and clips are sent to YouTube'
                ],
                specs: [
                    { label: 'Architecture', value: 'Vercel Dashboard + Local Worker Bridge' },
                    { label: 'Rendering', value: 'Local GPU (NVENC/AMF) · 5–10x faster' },
                    { label: 'Clip Intelligence', value: 'Gemini 2.5 Flash Brainstorming' },
                    { label: 'Platform', value: 'Docker · Hugging Face Spaces' }
                ],
                stack: ['Next.js 14', 'FastAPI', 'SQLite (WAL Mode)', 'yt-dlp', 'Google Gemini 2.5 Flash', 'FFmpeg v11', 'Docker', 'Vercel', 'Hugging Face Spaces'],
                devnotes: 'The core architectural decision — moving the download worker to local residential hardware — was forced by YouTube\'s aggressive datacenter IP blocking. Cobalt API and AllOrigins, which we initially used as proxies, were clustered with malicious bot traffic by YouTube\'s abuse mitigation and blocked. Home Wi-Fi bypasses this completely. The SQLite WAL (Write-Ahead Logging) mode was chosen specifically so the Vercel edge function and the local worker can read and write the database concurrently without locking — critical for a reliable job queue.',
                outcome: 'Clip processing time dropped from 2–4 hours of manual work to under 5 minutes per clip. GPU rendering (NVENC on local hardware) is 5–10x faster than the previous AWS Lambda CPU approach. The local IP strategy has a 100% download success rate where the cloud approach was consistently blocked. The system is currently in active beta with real streamer VOD content.'
            }
        };

        /* ── DOM refs ── */
        const modal        = document.getElementById('doc-modal');
        const backdrop     = modal?.querySelector('.doc-modal-backdrop');
        const closeBtn     = document.getElementById('doc-modal-close');
        const elNum        = document.getElementById('doc-modal-num');
        const elType       = document.getElementById('doc-modal-type');
        const elTitle      = document.getElementById('doc-modal-title');
        const elStatus     = document.getElementById('doc-badge-status');
        const elRole       = document.getElementById('doc-badge-role');
        const elTimeline   = document.getElementById('doc-badge-timeline');
        const elProblem    = document.getElementById('doc-problem');
        const elSolution   = document.getElementById('doc-solution');
        const elSteps      = document.getElementById('doc-steps');
        const elSpecsGrid  = document.getElementById('doc-specs-grid');
        const elChips      = document.getElementById('doc-chips');
        const elDevnotes   = document.getElementById('doc-devnotes');
        const elOutcome    = document.getElementById('doc-outcome');

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

            /* Show */
            modal.classList.add('open');
            document.body.classList.add('modal-open');

            /* Scroll modal body to top */
            const panel = modal.querySelector('.doc-modal-panel');
            if (panel) panel.scrollTop = 0;

            /* Stagger-animate sections in */
            const sections = modal.querySelectorAll('.doc-section, .doc-specs-grid');
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
    }

});