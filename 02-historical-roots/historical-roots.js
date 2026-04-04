// ===== Floating Particles =====
(function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['rgba(232,164,74,0.5)', 'rgba(196,111,211,0.4)', 'rgba(228,228,232,0.2)'];
    for (let i = 0; i < 20; i++) {
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

// ===== Cursor Glow (handled by shared-enhancements.js) =====

// ===== Scroll Reveal =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .footer').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + 's';
    revealObserver.observe(el);
});

// ===== Timeline Items Reveal =====
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.transitionDelay = (i * 0.12) + 's';
    timelineObserver.observe(item);
});

// ===== Parallax on hero scroll (handled by shared-enhancements.js) =====

// ===== Nav background on scroll =====
const nav = document.querySelector('.nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.style.background = window.scrollY > 50
            ? 'rgba(14, 14, 18, 0.95)'
            : 'rgba(14, 14, 18, 0.85)';
    }, { passive: true });
}

// ===== Key point hover tilt =====
document.querySelectorAll('.key-point').forEach((point) => {
    point.addEventListener('mousemove', (e) => {
        const rect = point.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        point.style.transform = 'translateY(-3px) perspective(500px) rotateX(' + (y * -4) + 'deg) rotateY(' + (x * 4) + 'deg)';
    });
    point.addEventListener('mouseleave', () => {
        point.style.transform = '';
    });
});

// ===== Popup Helper =====
function setupPopup(imageId, popupId, closeId) {
    const image = document.getElementById(imageId);
    const popup = document.getElementById(popupId);
    const close = document.getElementById(closeId);
    if (!image || !popup) return;

    image.addEventListener('click', () => popup.classList.add('active'));
    close.addEventListener('click', () => popup.classList.remove('active'));
    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.classList.remove('active');
    });
}

setupPopup('guernicaImage', 'guernicaPopup', 'guernicaClose');
setupPopup('riveraImage', 'riveraPopup', 'riveraClose');
