// ═══════════════════════════════════════
// LeSanjura — Shared JavaScript
// ═══════════════════════════════════════

// Navigation scroll effect
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(el => observer.observe(el));
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const answer = item.querySelector('.faq-answer');
        const wasOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-answer').style.maxHeight = null;
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Open clicked (if wasn't open)
        if (!wasOpen) {
            item.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// Smooth scroll for anchor links (within same page)
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            const navHeight = document.querySelector('.nav')?.offsetHeight || 52;
            window.scrollTo({
                top: target.offsetTop - navHeight - 16,
                behavior: 'smooth'
            });
        }
    });
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('formSubmitBtn');
        const feedback = document.getElementById('formFeedback');
        const originalText = btn.textContent;

        btn.disabled = true;
        btn.textContent = 'Enviando...';
        feedback.className = 'form-feedback';
        feedback.textContent = '';

        const data = {
            nombre: contactForm.nombre.value,
            telefono: contactForm.telefono.value,
            email: contactForm.email.value,
            servicio: contactForm.servicio.value,
            mensaje: contactForm.mensaje.value,
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
            btn.textContent = originalText;
        }
    });
}
