document.addEventListener('DOMContentLoaded', () => {

    /* ═══════════════════════════════════════════
       0. PRECISION BINARY LOADER (v3)
    ═══════════════════════════════════════════ */
    const loader      = document.getElementById('loader');
    const rainCanvas  = document.getElementById('rain-canvas');
    const rainCtx     = rainCanvas.getContext('2d');
    const ldRingProg  = document.getElementById('ld-ring-prog');
    const ldNumEl     = document.getElementById('ld-num');
    const ldMsgEl     = document.getElementById('ld-msg');
    const ldIris      = document.getElementById('ld-iris');

    let rainWidth, rainHeight, columns;
    const fontSize = 14;
    const chars    = "01010101010101010101";
    let drops      = [];

    function initRain() {
        rainWidth  = rainCanvas.width  = window.innerWidth;
        rainHeight = rainCanvas.height = window.innerHeight;
        columns    = Math.floor(rainWidth / fontSize);
        drops      = Array(columns).fill(1);
    }
    initRain();
    window.addEventListener('resize', initRain);

    function drawRain() {
        rainCtx.fillStyle = 'rgba(5, 7, 16, 0.15)';
        rainCtx.fillRect(0, 0, rainWidth, rainHeight);
        rainCtx.fillStyle = '#AAFF5E';
        rainCtx.font      = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            rainCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > rainHeight && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    let rainInterval = setInterval(drawRain, 33);

    const loaderMsgs = [
        "SYSTEM INIT", "KERNEL BOOT", "MAPPING DEPTH", 
        "LINKING ASSETS", "STABILIZING UI", "ACCESS GRANTED"
    ];
    let ldProgress = 0;
    const ldRingCirc = 534; // 2 * PI * 85 approx

    const ldTimer = setInterval(() => {
        ldProgress += Math.random() * 2.5 + 0.5;
        if (ldProgress >= 100) {
            ldProgress = 100;
            clearInterval(ldTimer);
            finishLoader();
        }

        // Update ring
        if (ldRingProg) {
            ldRingProg.style.strokeDashoffset = ldRingCirc - (ldProgress / 100) * ldRingCirc;
        }
        // Update number
        if (ldNumEl) {
            ldNumEl.textContent = String(Math.floor(ldProgress)).padStart(3, '0');
        }
        // Update message
        const msgIdx = Math.min(Math.floor((ldProgress / 100) * loaderMsgs.length), loaderMsgs.length - 1);
        if (ldMsgEl) ldMsgEl.textContent = loaderMsgs[msgIdx];
    }, 45);

    function finishLoader() {
        setTimeout(() => {
            clearInterval(rainInterval);
            loader.classList.add('exit');
            ldIris.classList.add('open');

            // Fire Main Entrance
            document.getElementById('left-panel')?.classList.add('panel-loaded');
            document.querySelector('.lp-nav')?.classList.add('nav-loaded');
            runHeroEntrance();

            setTimeout(() => {
                loader.style.display = 'none';
                initScrollObservers();
                initWordSplitReveal();
                initFooterAnimation();
                initRotatingText();
                initStickySection();
                initImpactStats();
                initSectionFlashes();
                initQuoteParallax();
            }, 950);
        }, 600);
    }


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
        // No scroll listener — words stay locked once revealed
    }

});