/* ═══════════════════════════════════════════════════
   HAZY PORTFOLIO — animations.js
   Load AFTER main.js

   Handles:
   01. Sidebar panel-loaded trigger (hooks into loader exit)
   02. nav-loaded fix (main.js used getElementById vs querySelector)
   03. Pill stagger scroll observer
   04. Footer slide + logo char reveal
   05. Contact form field cascade
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────────────
       01. LOADER EXIT HOOK
       Watch for .exit class on #loader, then:
       - Add nav-loaded to .lp-nav  (fixes main.js getElementById bug)
       - Add panel-loaded to #left-panel (triggers sidebar animations)
    ───────────────────────────────────────────────── */
    const loader    = document.getElementById('loader');
    const leftPanel = document.getElementById('left-panel');
    const lpNav     = document.querySelector('.lp-nav');

    if (loader) {
        const loaderWatcher = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'attributes' && loader.classList.contains('exit')) {
                    // Fix: querySelector vs getElementById
                    if (lpNav) lpNav.classList.add('nav-loaded');
                    // Trigger sidebar entrance with slight delay
                    if (leftPanel) {
                        setTimeout(() => leftPanel.classList.add('panel-loaded'), 80);
                    }
                    loaderWatcher.disconnect();
                    break;
                }
            }
        });
        loaderWatcher.observe(loader, { attributes: true, attributeFilter: ['class'] });
    }


    /* ─────────────────────────────────────────────────
       03. PILL STAGGER
       Observes each .sk-row; when visible, reveals each .pill
       inside with an individual animation-delay so they bubble up
       in sequence from left-to-right.
    ───────────────────────────────────────────────── */
    const pillRowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const pills = entry.target.querySelectorAll('.pill');
            pills.forEach((pill, i) => {
                // Stagger delay: 40ms base + 55ms per pill
                pill.style.animationDelay = `${40 + i * 55}ms`;
                pill.classList.add('pill-on');
            });

            pillRowObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.sk-row').forEach(row => pillRowObserver.observe(row));


    /* ─────────────────────────────────────────────────
       04. FOOTER ENTRANCE + LOGO CHAR REVEAL
       When footer enters viewport:
       - Slide the whole footer up (CSS handles it)
       - Split "HAZY" into individual <span.f-char> elements
       - Stagger each char in with a rotate + translateY
    ───────────────────────────────────────────────── */
    const footer = document.querySelector('footer');
    if (footer) {
        // Rebuild footer logo as char spans
        const logoEl = footer.querySelector('div:first-child');
        if (logoEl) {
            // "H" is plain, "AZY" is accent — rebuild precisely
            logoEl.innerHTML =
                `<span class="f-char">H</span>` +
                `<span class="f-char"><span class="accent-txt">A</span></span>` +
                `<span class="f-char"><span class="accent-txt">Z</span></span>` +
                `<span class="f-char"><span class="accent-txt">Y</span></span>`;
        }

        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                // Trigger footer slide-up
                footer.classList.add('footer-on');

                // Stagger chars: 150ms base, 90ms apart
                footer.querySelectorAll('.f-char').forEach((ch, i) => {
                    setTimeout(() => ch.classList.add('ch-on'), 150 + i * 90);
                });

                footerObserver.unobserve(footer);
            });
        }, { threshold: 0.25 });

        footerObserver.observe(footer);
    }


    /* ─────────────────────────────────────────────────
       05. CONTACT FORM FIELD CASCADE
       Observes the whole .contact-form; when visible,
       staggers each .fg field down sequentially, then
       pops the submit button in last.
    ───────────────────────────────────────────────── */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const formObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const fgs = entry.target.querySelectorAll('.fg');
                fgs.forEach((fg, i) => {
                    // Cascade: 80ms base + 110ms apart
                    setTimeout(() => fg.classList.add('fg-on'), 80 + i * 110);
                });

                // Button pops after all fields
                const btn = entry.target.querySelector('.btn-submit');
                if (btn) {
                    const delay = 80 + fgs.length * 110 + 100;
                    setTimeout(() => btn.classList.add('btn-on'), delay);
                }

                formObserver.unobserve(entry.target);
            });
        }, { threshold: 0.08 });

        formObserver.observe(contactForm);
    }

});
