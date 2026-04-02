// ═══════════════════════════════════════
// LeSanjura — Shared JavaScript
// Studio AI → Static HTML Port
// ═══════════════════════════════════════

// ─── PAGE LOADER ───────────────────────
const pageLoader = document.getElementById('pageLoader');
if (pageLoader) {
    if (!sessionStorage.getItem('introPlayed')) {
        sessionStorage.setItem('introPlayed', 'true');
        setTimeout(() => {
            pageLoader.classList.add('out');
            setTimeout(() => pageLoader.remove(), 600);
        }, 1900);
    } else {
        pageLoader.remove();
    }
}


// ─── NAVIGATION SCROLL ─────────────────
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ─── MOBILE MENU ───────────────────────
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

// ─── INTERSECTION OBSERVER REVEALS ─────
const ioReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            ioReveal.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Clip reveals
document.querySelectorAll('.reveal-clip').forEach(el => ioReveal.observe(el));

// Fade reveals
document.querySelectorAll('.reveal-fade').forEach(el => ioReveal.observe(el));

// Section lines
document.querySelectorAll('.section-line').forEach(el => ioReveal.observe(el));

// Quote break clip
document.querySelectorAll('.quote-text-inner').forEach(el => ioReveal.observe(el));

// Section titles clip
document.querySelectorAll('.clip-reveal-inner').forEach(el => ioReveal.observe(el));

// ─── COUNTER ANIMATION ─────────────────
const ioCounter = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count || el.textContent, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            const current = Math.floor(eased * target);
            el.textContent = current.toString().padStart(2, '0') + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        ioCounter.unobserve(el);
    });
}, { threshold: 0.3 });

document.querySelectorAll('.counter').forEach(el => ioCounter.observe(el));

// ─── PARALLAX IMAGES ───────────────────
const parallaxImgs = document.querySelectorAll('.parallax-img');
if (parallaxImgs.length > 0) {
    const updateParallax = () => {
        parallaxImgs.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            const vh = window.innerHeight;
            const progress = (vh - rect.top) / (vh + rect.height);
            const clamped = Math.max(0, Math.min(1, progress));
            const y = (clamped - 0.5) * 40;
            img.style.transform = `scale(1.4) translateY(${y}%)`;
        });
    };
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
}

// ─── TEAM ACCORDION ────────────────────
const teamItems = document.querySelectorAll('.team-item');
teamItems.forEach(item => {
    const trigger = item.querySelector('.team-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        teamItems.forEach(i => {
            i.classList.remove('open');
            const p = i.querySelector('.team-panel');
            if (p) p.style.maxHeight = '0';
        });

        // Open clicked if it was closed
        if (!isOpen) {
            item.classList.add('open');
            const panel = item.querySelector('.team-panel');
            if (panel) {
                // Temporarily make visible to measure, then animate
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        }
    });
});

// ─── FAQ ACCORDION ─────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const answer = item.querySelector('.faq-answer');
        const wasOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            openItem.classList.remove('open');
            const a = openItem.querySelector('.faq-answer');
            if (a) a.style.maxHeight = '0';
        });

        // Open clicked
        if (!wasOpen) {
            item.classList.add('open');
            if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            const navHeight = nav ? nav.offsetHeight : 80;
            window.scrollTo({
                top: target.offsetTop - navHeight - 16,
                behavior: 'smooth'
            });
        }
    });
});

// ─── HASH ANCHOR ON LOAD ───────────────
window.addEventListener('load', () => {
    if (location.hash) {
        const target = document.querySelector(location.hash);
        if (target) {
            setTimeout(() => {
                const navHeight = nav ? nav.offsetHeight : 80;
                window.scrollTo({
                    top: target.offsetTop - navHeight - 16,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }
});

// ─── CONTACT FORM ──────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn      = document.getElementById('formSubmitBtn');
        const feedback = document.getElementById('formFeedback');
        const origText = btn.textContent;

        btn.disabled = true;
        btn.textContent = 'Enviando...';
        feedback.className = 'form-feedback';
        feedback.textContent = '';

        const data = {
            nombre:   contactForm.nombre?.value,
            telefono: contactForm.telefono?.value,
            email:    contactForm.email?.value,
            servicio: contactForm.servicio?.value,
            mensaje:  contactForm.mensaje?.value,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                feedback.className = 'form-feedback success';
                feedback.textContent = 'Mensaje enviado. Nos comunicaremos con usted pronto.';
                contactForm.reset();
            } else {
                throw new Error('Error');
            }
        } catch {
            feedback.className = 'form-feedback error';
            feedback.textContent = 'Hubo un error al enviar. Intente de nuevo o escríbanos por WhatsApp.';
        } finally {
            btn.disabled = false;
            btn.textContent = origText;
        }
    });
}

