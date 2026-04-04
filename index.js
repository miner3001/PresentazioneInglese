// ===== Floating Particles =====
(function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['rgba(232,164,74,0.5)', 'rgba(196,111,211,0.4)', 'rgba(228,228,232,0.2)'];

    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 4 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDuration = (Math.random() * 12 + 8) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(p);
    }
})();

// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// ===== Card Mouse-Follow Glow =====
document.querySelectorAll('.toc-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
    });
});

// ===== Scroll Reveal Observer =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

// Observe the section heading
document.querySelectorAll('.section-heading, .footer').forEach((el) => {
    revealObserver.observe(el);
});

// ===== Staggered Card Entrance =====
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.toc-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = (i * 0.1) + 's';
    cardObserver.observe(card);
});

// ===== Parallax on Hero (mouse) =====
const heroContent = document.querySelector('.hero-content');
const hero = document.querySelector('.hero');
if (hero && heroContent) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        heroContent.style.transform = `translate(${x * -12}px, ${y * -12}px)`;
    });

    hero.addEventListener('mouseleave', () => {
        heroContent.style.transition = 'transform 0.5s ease';
        heroContent.style.transform = 'translate(0, 0)';
        setTimeout(() => { heroContent.style.transition = ''; }, 500);
    });
}

// ===== Tilt effect on cards =====
document.querySelectorAll('.toc-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) scale(1.02) perspective(600px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== Scroll-driven parallax for hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (hero) {
        const overlay = hero.querySelector('.hero-overlay');
        if (overlay) {
            overlay.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        if (heroContent) {
            heroContent.style.opacity = 1 - scrolled / 600;
        }
    }
}, { passive: true });
