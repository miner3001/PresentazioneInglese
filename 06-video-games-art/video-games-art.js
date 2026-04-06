/* ===== Video Games as Art — Chapter 06 JS ===== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Particles --- */
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('span');
            p.classList.add('particle');
            const size = Math.random() * 4 + 2;
            p.style.width  = size + 'px';
            p.style.height = size + 'px';
            p.style.left   = Math.random() * 100 + '%';
            p.style.background = Math.random() > 0.5
                ? 'rgba(232,164,74,0.4)'
                : 'rgba(196,111,211,0.4)';
            p.style.animationDuration = (Math.random() * 10 + 8) + 's';
            p.style.animationDelay    = (Math.random() * 8) + 's';
            particleContainer.appendChild(p);
        }
    }

    /* --- Scroll Reveal --- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObs.observe(el));

    /* --- Gallery Card Stagger --- */
    const galleryCards = document.querySelectorAll('.gallery-card');
    const cardObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.parentElement.querySelectorAll('.gallery-card');
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('visible'), i * 120);
                });
                cardObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    if (galleryCards.length > 0) {
        cardObs.observe(galleryCards[0]);
    }

    /* --- Nav background on scroll --- */
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.style.background = window.scrollY > 100
                ? 'rgba(14,14,18,0.95)'
                : 'rgba(14,14,18,0.85)';
        });
    }

    /* --- Key-point tilt --- */
    document.querySelectorAll('.key-point').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `translateY(-3px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* --- Footer reveal --- */
    const footer = document.querySelector('.footer');
    if (footer) {
        const fObs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) footer.classList.add('visible');
        }, { threshold: 0.3 });
        fObs.observe(footer);
    }

    /* --- Popup Helpers --- */
    function setupPopup(triggerId, popupId, closeId) {
        const trigger = document.getElementById(triggerId);
        const popup   = document.getElementById(popupId);
        const close   = document.getElementById(closeId);
        if (!trigger || !popup) return;

        trigger.addEventListener('click', () => popup.classList.add('active'));

        if (close) {
            close.addEventListener('click', () => popup.classList.remove('active'));
        }

        popup.addEventListener('click', e => {
            if (e.target === popup) popup.classList.remove('active');
        });
    }

    setupPopup('rdr2Image', 'rdr2Popup', 'rdr2Close');

    /* --- Close popups with Escape --- */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.popup-overlay.active').forEach(p => {
                p.classList.remove('active');
            });
        }
    });
});
